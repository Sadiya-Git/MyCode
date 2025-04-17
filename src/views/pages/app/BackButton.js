import React from 'react';
import {
    Button,
    Row,
    Col,
} from 'reactstrap';
import { useNavigate } from "react-router-dom"
const BackButton = () => {
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate(-1)
    }
    return (
        <Row className="mb-3">
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="9">

            </Col>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="2"></Col>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="1">
                <Button
                    color="primary"
                    // href="#pablo"
                    onClick={() => handleBackButton()}
                    size="lg"
                >
                    Back
                </Button>
                        
            </Col>
        </Row>
    )
}
export default BackButton
