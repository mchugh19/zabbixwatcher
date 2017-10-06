zabbixnotifier
==============

Zabbix Notifier for Mozilla Firefox

![
](https://github.com/rsanting/zabbixnotifier/blob/master/screenshot.png)


features:
With this extension, current status messages of the Zabbix monitoring system are displayed directly in the browser. Faults and problems are detected quickly and reliably. Due to the changing color of the icon in the browser's browser bar, the monitored systems and services can be viewed at a glance.

details:
- Tested with Zabbix 2.0.x
- Use the Zabbix API
- User name, password, URL, port, notification sound and update interval are configurable

ChangeLog:
- 1.1.3 - Fixes login issues related to Zabbix 2.0.4
- 1.2   - Bugfixes (Update-Problems), Number of Problems is displayed in the icon
- 1.3   - Bugfix (Wrong icon when there are no notifications)
- 1.4   - Dependency Checking (skipDependent: '1')
- 1.5   - Hide Acknowledged Events (config.hideAck: 'true') & Reactivate Simple Notification Popup
- 1.6   - Bugfix Zabbix 2.4 Authentication
- 1.6.1 - Add feature filter by group
- 1.7   - Add support for zabbix 3.4, display the System Name
- 1.7.3 - Added Mozilla Firefox support
