/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"feedback/POFeedack/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"feedback/POFeedack/test/integration/pages/App",
	"feedback/POFeedack/test/integration/pages/Browser",
	"feedback/POFeedack/test/integration/pages/Master",
	"feedback/POFeedack/test/integration/pages/Detail",
	"feedback/POFeedack/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "feedback.POFeedack.view."
	});

	sap.ui.require([
		"feedback/POFeedack/test/integration/NavigationJourneyPhone",
		"feedback/POFeedack/test/integration/NotFoundJourneyPhone",
		"feedback/POFeedack/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});