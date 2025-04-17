
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  Container,
  Row,
  Col,
} from "reactstrap";
const Upgrade = () => {
  

  return (
    <>
      <div className="header pb-8 pt-5 pt-md-5">

        {/* <span className="mask bg-gradient-default opacity-8" /> */}
        <Container className="align-items-center" fluid>
          <Row>
            <Col lg="7" xl="10">
              <h3 className="mb-0 display-3 text-gradient-darker">Upgrade Account</h3>
            </Col>
          </Row>
        </Container><br/>
        <Container fluid>
          <Row>
            <Col className="order-xl-1" xl="4" style={{ borderRadius: '10%' }}>
              <Card className="bg-secondary shadow " >
                <CardHeader className="bg-gradient-white border-0">
                  <Row className="align-items-center">
                    <Col xs="10">
                      <h3 className="mb-0  " style={{ fontWeight: 'bolder' }}> Based on your responses, your score is:</h3>
                    </Col>
                    <Col xs="2">
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="bg-gradient-white">
                  <Form>
                    <h4 className="mb-4">

                      It seems that there is some confusion in your answers. Let me provide you with the correct answers and relevant feedback for each question, along with two study YouTube links to help you learn more about AWS.

                    </h4>


                    {/* <h6 className="heading-small text-muted mb-4">About me</h6> */}
                    <div className="pl-lg-4">
                    <ul className="dot-line-ul">

                      </ul>

                      </div>
                    <hr className="my-4 bg-white" />

                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="4" style={{ borderRadius: '10%' }}>
              <Card className="bg-secondary shadow " >
                <CardHeader className="bg-gradient-default border-0">
                  <Row className="align-items-center">
                    <Col xs="10">
                      <h3 className="mb-0 text-white " style={{ fontWeight: 'bolder' }}> Based on your responses, your score is:</h3>
                    </Col>
                    <Col xs="2">
                      {/* <h3 className="mb-0 text-orange " style={{ fontWeight: 'bolder' }}>0 out of 10</h3> */}

                    </Col>

                  </Row>
                </CardHeader>
                <CardBody className="bg-gradient-default">
                  <Form>
                    <h4 className=" text-white mb-4">

                      It seems that there is some confusion in your answers. Let me provide you with the correct answers and relevant feedback for each question, along with two study YouTube links to help you learn more about AWS.

                    </h4>


                    {/* <h6 className="heading-small text-muted mb-4">About me</h6> */}
                    <div className="pl-lg-4">
                    <ul className="dot-line-ul text-white">

{/* {feedback.map((item,key)=>{
  return (
                        <li className="dot-line-li">{key+1}. {item.question.text}<br /><br />

                          <li className="text-success">-Selected Answer  </li>{item.chosen_option.text}
                          <br />
                          <br />
                          

                          <li className="text-yellow">- Feedback</li>{item.feedback}
                          </li>

                       
                    
  )
})} */}
                      </ul>

                      </div>
                    <hr className="my-4 bg-white" />

                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="4" style={{ borderRadius: '10%' }}>
              <Card className="bg-secondary shadow " >
                <CardHeader className="bg-gradient-white border-0">
                  <Row className="align-items-center">
                    <Col xs="10">
                      <h3 className="mb-0  " style={{ fontWeight: 'bolder' }}> Based on your responses, your score is:</h3>
                    </Col>
                    <Col xs="2">
                      {/* <h3 className="mb-0 text-orange " style={{ fontWeight: 'bolder' }}>0 out of 10</h3> */}
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="bg-gradient-white">
                  <Form>
                    <h4 className="mb-4">

                      It seems that there is some confusion in your answers. Let me provide you with the correct answers and relevant feedback for each question, along with two study YouTube links to help you learn more about AWS.

                    </h4>


                    {/* <h6 className="heading-small text-muted mb-4">About me</h6> */}
                    <div className="pl-lg-4">
                    <ul className="dot-line-ul ">

{/* {feedback.map((item,key)=>{
  return (
                        <li className="dot-line-li">{key+1}. {item.question.text}<br /><br />

                          <li className="text-success">-Selected Answer  </li>{item.chosen_option.text}
                          <br />
                          <br />
                          

                          <li className="text-yellow">- Feedback</li>{item.feedback}
                          </li>

                       
                    
  )
})} */}
                      </ul>

                      </div>
                    <hr className="my-4 bg-white" />

                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Upgrade;
