(function() {
  var templates = Ember.TEMPLATES = Handlebars.templates || {};

  templates['overview'] = Handlebars.template(function (Handlebars,depth0) {
    var buffer = "", escapeExpression=this.escapeExpression;

    function populateHostGroups(groupData) {
      var buffer = "";
      buffer += `<option value="` + escapeExpression(groupData.groupid) + `">`;
      buffer += escapeExpression(groupData.name) + "</option>\n		";
      return buffer;
    }

    function populateItems(triggerData) {
      var config = $.getLocalConfig();
      var buffer = "";

      buffer += `<tr class="` + escapeExpression(triggerData.priorityClass) + ` odd"><td class="system">`;
      buffer += `<i class="arrow" title="arrow icon"></i>` + escapeExpression(triggerData.host)
      buffer += `
      </td>
      <td class="name">`;
      buffer += escapeExpression(triggerData.name) + `</td><td class="priority">`;
      buffer += escapeExpression(triggerData.priority) + `</td><td class="age">`;
      buffer += escapeExpression(triggerData.age) + "</td></tr>";
      buffer += `<tr id="advanced" class="hidden"><td id="` + escapeExpression(triggerData.triggerid) + `" colspan="4">
      <a href="` + config.zabbixBase + `hostinventories.php?hostid=` + triggerData.hostid + `" class="button zablink" id="zablink" target="_blank">Host Details</a>
      <a href="` + config.zabbixBase + `latest.php?fullscreen=0&filter_set=1&show_without_data=1&hostids%5B%5D=` + triggerData.hostid + `" class="button zablink" id="zablink" target="_blank">Latest Data</a>
      <a href="` + config.zabbixBase + `charts.php?fullscreen=0&groupid=0&graphid=0&hostid=` + triggerData.hostid + `" class="button zablink" id="zablink" target="_blank">Host Graphs</a>
        | <a href="` + config.zabbixBase + `zabbix.php?action=problem.view&filter_set=1&filter_triggerids%5B%5D=` + triggerData.triggerid + `" class="button zablink" id="zablink" target="_blank">Problem Details</a>
      <a class="button zablink" id="eventLink">Event Details</a>
      <a class="button zablink" id="eventAck">Ack Event</a>
      </td></tr>`;
      return buffer;
    }

    buffer += `
    <div id="header"><h1>Zabbix Watcher: Overview</h1></div>
    <hr /><div id="menu">
    <input type="search" id="filter" placeholder="Filter Results">
    | <label>Group : </label>
    <select id="groupid" multiple="multiple">`;
    var hostgroupHTML = "";
    $(depth0.data.grouphostList).each(function(iterator, value) {
      hostgroupHTML += populateHostGroups(value);
    });
    if(hostgroupHTML || hostgroupHTML === 0) { buffer += hostgroupHTML; }
    buffer += `
    </select>
    <!-- <button id="refresh">&#8635;</button> -->
    | <span class="link" id="settingsButton">Settings</span>
    | <span class="link" id="zabbixButton">Open Zabbix</span>
    </div><hr />
    <table class="overview details">
    <tbody id="triggerTable">
    <tr class="header">
      <th>System</th>
      <th>Description</th>
      <th>Priority</th>
      <th>Age</th>
    </tr>
    `;
    var triggerHTML = "";
    $(depth0.data.triggerList).each(function(iterator, value) {
      triggerHTML += populateItems(value);
    });
    if(triggerHTML || triggerHTML === 0) { buffer += triggerHTML; }
    buffer += "</tbody></table>";
    return buffer;
  });


  templates['settings'] = Handlebars.template(function (Handlebars,depth0) {
    var buffer = "", escapeExpression=this.escapeExpression;

    buffer += `<div id="header"><h1>Zabbix Watcher: Settings</h1></div><hr />
    <div id="settings"><form><div><label for="zabbixBase">Zabbix Base: </label><input id="zabbixBase" type="text" value="`;
    buffer += escapeExpression(depth0.data.zabbixBase) + `" /></div><div><label for="zabbixUser">Zabbix User: </label><input id="zabbixUser" type="text" value="`;
    buffer += escapeExpression(depth0.data.zabbixUser) + `" /></div><div><label for="zabbixPass">Zabbix Pass: </label><input id="zabbixPass" type="password" value="***********" /></div><div><label for="interval">Update Interval (s): </label><input id="interval" type="text" value="`;
    buffer += escapeExpression(depth0.data.interval) + `" /></div><div><label for="playSound">Play Sound: </label><input id="playSound" name="playSound" type="radio" value="true" `;
    if (depth0.data.playSound) {buffer += `checked="checked"`;}
    buffer += `>Yes</input><input id="playSound" name="playSound" type="radio" value="false" `;
    if (!depth0.data.playSound) {buffer += `checked="checked"`;}
    buffer += `>No</input></div><div><label for="hideAck">Hide Ack Events: </label><input id="hideAck" name="hideAck" type="radio" value="true" `;
    if (depth0.data.hideAck) {buffer += `checked="checked"`;}
    buffer += `>Yes</input><input id="hideAck" name="hideAck" type="radio" value="false" `;
    if (!depth0.data.hideAck) {buffer += `checked="checked"`;}
    buffer += `>No</input></div><div class="buttons"><input id="saveButton" type="submit" value="Save" /><input id="cancelButton" type="button" value="Cancel" /></div></form></div>`;
    return buffer;
  });
})();
