/*global location */
sap.ui.define([
		"feedback/POFeedack/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"feedback/POFeedack/model/formatter"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("feedback.POFeedack.controller.Detail", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "detailView");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("detailView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name : "sap.collaboration.components.fiori.sharing.dialog",
						settings : {
							object :{
								id : location.href,
								share : oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});

				oShareDialog.open();
			},
			onPress: function() {
			var sUrl = "/sap/opu/odata/sap/ZPTML_PO_EXT_SRV/";
			var oJSONModel = new sap.ui.model.json.JSONModel();
			//this.getView().setModel(oJSONModel, "jsonmodel");
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			oModel.read("/UserSet", {
				success: function(data) {
					oJSONModel.setData({
						UserSet: data.results
					});
				}
			});

			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new sap.m.Dialog({
						type: sap.m.DialogType.Message,
						title: "Confirm",
						content: [
							new sap.m.Label({
								text: "Enter User",
								labelFor: "userInput"
							}),
							new sap.m.Input({
								id: "userInput",
								text: "userInput",
								placeholder: "Enter User",
								required: true,
								showSuggestion: true,
								suggestionItems: {
									path: "/UserSet",
									template: new sap.ui.core.Item({
										text: "{NameTextc}",
										key: "{Bname}"
									})
								},
								change: function(oEvent) {
									var sText = oEvent.getParameter("value");
									this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
								}.bind(this)
							}),
							new sap.m.Label({
								text: "Comments",
								labelFor: "submissionNote"
							}),
							new sap.m.TextArea("submissionNote", {
								width: "100%",
								placeholder: "Add Comments (required)",
								liveChange: function(oEvent) {
									var sText = oEvent.getParameter("value");
									this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
								}.bind(this)
							})
						],
						beginButton: new sap.m.Button({
								type: sap.m.ButtonType.Emphasized,
								text: "Submit",
								enabled: false,
								press: function() {
									var sUrl = "/sap/opu/odata/sap/YPO_FEEDBACK_SRV/";
									var oAppComments = new sap.ui.model.odata.ODataModel(sUrl, true);
									var ponum =sap.ui.getCore().byId("application-feedback-display-component---detail--objectHeader");
									var objectAttributes = ponum.getAggregation("attributes");
									var text = objectAttributes[1].getText(); //CurrNotice
									var objectAttributes = text.substring(11,22);
									var sText = sap.ui.getCore().byId("submissionNote").getValue();
									var user = sap.ui.getCore().byId('userInput').getSelectedKey();
									sap.m.MessageToast.show("Note is: " + sText);
									//var login_user = sap.ushell.Container.getUser().getId();
									var oComments = {};
									oComments.Ebeln = objectAttributes;
									//oComments.Uname = login_user; //setting this in backend system
									oComments.Ycomm = sText;
									oComments.Ydate = "2022-07-05"; //setting this in backend system
									oComments.Ytime = "12:00:48"; //setting this in backend system
									oComments.Rname = user;

									oAppComments.create('POCommSet', oComments, null, function(odata, response){
											//console.log(response);
										sap.m.MessageToast.show("notification has been send to user" + user);
										sap.ui.getCore().byId("__list0").getModel().refresh(true);
									});
								this.oSubmitDialog.close();
							}.bind(this)
						}),
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function() {
							this.oSubmitDialog.close();
						}.bind(this)
					})
				});
		}
		//sap.ui.getCore().byId("userInput").setValue('test');
	sap.ui.getCore().byId("userInput").setModel(oJSONModel);
	this.oSubmitDialog.open();

},
                                handleLinkPO: function(oEvent) {
                                                //alert("You click on PO");
                                                // display dialog to display PO Details
                                                  var PoNo;
                                                  PoNo = "";
                                                 var gFlag = "X";
                                                  
                                                  PoNo = this.getView().byId("poNumber").getText();

                                                  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                                                  var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                                                  target: {
                                                  semanticObject: "ZPTML_PO_01",
                                                  action: "display"
                                                  },
                                                  params: {
                                                  "poNumber": PoNo
                                                  }
                                                  })) || ""; // generate the Hash to display a Supplier
                                                  oCrossAppNavigator.toExternal({
                                                  target: {
                                                  shellHash: hash
                                                  }
                                                  }); // navigate to Supplier application
                                },


			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			onListUpdateFinished : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
				}
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("PONumSet", {
						Ebeln :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.Ebeln,
					sObjectName = oObject.Ebeln,
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView"),
					oLineItemTable = this.byId("lineItemsList"),
					iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);
				oViewModel.setProperty("/lineItemTableDelay", 0);

				oLineItemTable.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for line item table
					oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
				});

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}

		});

	}
);