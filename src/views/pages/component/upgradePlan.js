import React from "react";
import { Modal, Row, Col, Button, FormGroup, Label } from "reactstrap";
import { Alert, Stack } from "@mui/material";
import { Radio } from "antd"; // Importing Ant Design Radio

const UpgradeModal = ({
  showUpgrade,
  toggleModal,
  dataForModel,
  selectedDuration,
  handleDurationChange,
  handleShowCardPopup,
  plansButtonLabel,
  plansLabel
}) => {
  return (
    <Modal
      className="modal-dialog-centered divClassNameForModelPlans"
      contentClassName="bg-gradient-white"
      isOpen={showUpgrade}
      toggle={toggleModal}
    >
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity="info">Upgrade your plan to unlock premium features!</Alert>
      </Stack>

      <div className="modal-header">
        <h4 className="heading mt-4">
          <i className="ni ni-lock-circle-open ni-3x" />
          <b>Upgrade Your Plan</b>
        </h4>
        <button aria-label="Close" className="close" onClick={toggleModal}>
          <span aria-hidden={true}>×</span>
        </button>
      </div>

      <div className="modal-body modelBodyOPlans">
        <Row className="justify-content-center">
          {dataForModel.map((item) => {
            const firstOption = Object.keys(item.planDurationInDays || {})[0]; // Get the first available option
            return (
              <Col key={item.planName} className="order-xl-1 plansClass" xl="6" xs="12">
                <h2 className="heading text-gradient-default plansHeading">{item.planName}</h2>

                <div className="costForCoursePlans priceHeading">{item.plan}</div>

                <Label>Select Plan:</Label>

                {item.planDurationInDays && (
                  <FormGroup>
                    <Radio.Group
                      value={selectedDuration[item.planName] || firstOption} // Default to first option
                      onChange={(e) => handleDurationChange(item.planName, e.target.value)}
                    >
                      {Object.entries(item.planDurationInDays).map(([days, cost]) => (
                        <Radio key={days} value={days}>
                          {`${days} - ${cost}`}
                        </Radio>
                      ))}
                    </Radio.Group>

                    {/* {item.planType === "Free" && <span>0 USD</span>} */}
                  </FormGroup>
                )}

                <Button
                  className={
                    item.planType === "Free"
                      ? "text-white bg-gradient-gray mb-4 pointerEventsNone"
                      : "text-white bg-gradient-default mb-4"
                  }
                  disabled={item.planType === "Free"}
                  onClick={() => handleShowCardPopup(item.planName)}
                >
                  {plansButtonLabel[item.planName] || "Upgrade"}
                </Button>

                {/* Features List */}
                <h4 className="mb-4 plansFeaturesStart">{plansLabel[item.planName]}</h4>
                {item.features.map((feature, index) => (
                  <h4 key={index} className="text-gradient-default mb-4 flexForFeatures">
                    <i className="ni ni-check-bold ni-1x" />
                    <div className="plansFeaturesForPlans">{feature}</div>
                  </h4>
                ))}
              </Col>
            );
          })}
        </Row>
      </div>

      <div className="modal-footer">
        <Button className="text-white bg-gradient-default mb-4" onClick={toggleModal}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
