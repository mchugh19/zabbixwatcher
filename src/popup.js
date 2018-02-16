// Copyright (c) 2012 gigatec GmbH. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

$(document).ready(function() {

	// load data from backend
	Handlebars = chrome.extension.getBackgroundPage().Handlebars;
	Ember = chrome.extension.getBackgroundPage().Ember;
	App = chrome.extension.getBackgroundPage().App;

	var $body = $('body');

	// OVERVIEW
	var $overview = $.createView('overview', App.zabbixManager.get('zabbixStatus'), function($content) {

		var config = $.getLocalConfig();

		$content.find('#settingsButton').click(function() {
			$overview.hide();
			$settings.show();
			$body.show();
		});
		$content.find('#zabbixButton').click(function() {
			var zabbixUrl = App.zabbixManager.get('zabbixStatus').statusUrl;
			if (zabbixUrl) {
				window.open(zabbixUrl);
			}
		});

		// populate and activate multi-select
		$content.find('#groupid').val(config['groupid']);
		$content.find('#groupid').multipleSelect({
			placeholder: "All Hosts",
			filter: true,
			width: 360,
			selectAll: false
		});

		// Support toggle of advanced functionality row
		$(".overview tr:odd").addClass("odd");
		$(".overview tr.odd").click(function () {
			var trToToggle = $(this).next("tr");
			$(".overview tr:not(.odd)").not(trToToggle).hide();
			$(".overview tr.odd").not($(this)).find("i.arrow").removeClass("toggle-down");
			$(this).find("i.arrow").toggleClass("toggle-down");
			$(trToToggle).toggle();
		});

		// Create case insensative table filter
		$.extend($.expr[':'], {
			'containsi': function(elem, i, match, array)
			{
				return (elem.textContent || elem.innerText || '').toLowerCase()
				.indexOf((match[3] || "").toLowerCase()) >= 0;
			}
		});
		function filter(resultTable) {
			$("#triggerTable").find("tr").not("tr.header").hide();
			var rows = $("#triggerTable").find("tr").not("tr.header").not("#advanced");
			var data = resultTable.value.split(" ");
			$.each(data, function(i, v) {
				rows.filter(":containsi('" + v + "')").show();
			});
		}

		// Filter on enter or input clear
		$content.find("#filter").on('search', function() {
			filter(this);
		});
		// Filter on keypress
		$content.find("#filter").keyup(function() {
			filter(this);
		});

		$content.find('#refresh').click(function() {
			App.zabbixManager.refreshZabbixStatus();
			window.close();
		});

		$('body').on('click', 'a#eventLink', function() {
			var triggerid = $(this).closest('td').attr('id');
			getEvent(config, triggerid, function(eventId){
				window.open(config.zabbixBase + "tr_events.php?triggerid=" + triggerid + "&eventid=" + eventId,'_blank');
			});
		});
		$('body').on('click', 'a#eventAck', function() {
			var triggerid = $(this).closest('td').attr('id');
			getEvent(config, triggerid, function(eventId){
				window.open(config.zabbixBase + "zabbix.php?action=acknowledge.edit&eventids[]=" + eventId,'_blank');
			});
		});

		$content.find('#groupid').change(function() {
			var config = $.getLocalConfig();
			$.setLocalConfig({
				'zabbixBase': 	config['zabbixBase'],
				'zabbixUser': 	config['zabbixUser'],
				'zabbixPass': 	config['zabbixPass'],
				'playSound':  	config['playSound'],
				'hideAck': 		config['hideAck'],
				'interval': 	config['interval'],
				'groupid': 		$content.find('#groupid').val(),
			});
			App.zabbixManager.refreshZabbixStatus();
		});
	});


	// SETTINGS
	var $settings = $.createView('settings', $.getLocalConfig(), function($content) {

		$content.find('#saveButton').click(function() {
			var zabbixBase = $content.find('#zabbixBase').val();
			if (zabbixBase.length > 0 && !(/\/$/.test(zabbixBase))) {
				zabbixBase += '/';
			}
			var oldConfig = $.getLocalConfig();
			var zabbixPass = $content.find('#zabbixPass').val();
			if (zabbixPass == '***********') {
				zabbixPass = oldConfig['zabbixPass'];
			} else {
				zabbixPass = $.encrypt($content.find('#zabbixPass').val())
			}

			$.setLocalConfig({
				'zabbixBase': zabbixBase,
				'zabbixUser': $content.find('#zabbixUser').val(),
				'zabbixPass': zabbixPass,
                                'playSound': $content.find('input[name="playSound"][value="true"]').prop('checked') ? true : false,
                                'hideAck': $content.find('input[name="hideAck"][value="true"]').prop('checked') ? true : false,
				'interval': $content.find('#interval').val(),
				'groupid': oldConfig['groupid']
			});
			App.zabbixManager.changeConfiguration(function() {
				App.zabbixManager.refreshZabbixStatus();
			});
			window.close();
		});
		
		$content.find('#cancelButton').click(function() {
			window.close();
		});
	});

});

function getEvent(config, triggerid, cb) {
	var eventId;
	var parseEvent = function(result) {
		eventId = result['result'][0]['eventid'];
		success: cb(eventId);
	}

	eventZab = new $.jqzabbix({
		url: config['zabbixBase'] + 'api_jsonrpc.php',  // URL of Zabbix API
		username: config['zabbixUser'],   // Zabbix login user name
		password: $.decrypt(config['zabbixPass']),  // Zabbix login password
		basicauth: false,    // If you use basic authentication, set true for this option
		busername: '',       // User name for basic authentication
		bpassword: '',       // Password for basic authentication
		timeout: 5000,       // Request timeout (milli second)
		limit: 1000,         // Max data number for one request
	})

	var params = {
		"output": "extend",
		"select_acknowledges": "extend",
		"selectTags": "extend",
		"sortfield": ["clock", "eventid"],
		"objectids": triggerid,
		"sortorder": "DESC"
	};

	eventZab.getApiVersion(null, function() {
		eventZab.userLogin(null, function() {
			eventZab.sendAjaxRequest('event.get', params, parseEvent);
		})
	});
}