
import Profile from "views/pages/app/profile";
import Register from "views/pages/auth/register.js";
import Login from "views/pages/auth/login.js";
import Tables from "views/pages/app/tables.js";
import Quiz from "views/pages/app/quiz.js";
import Category from "views/pages/app/category.js"
import CertificationDetail from "views/pages/app/certificationdetail.js"
import Certification from "views/pages/app/certification.js"
import Feedback from "views/pages/app/feedback.js"
import Learning from "views/pages/app/learning.js"
import DetailLearning from "views/pages/app/detailLearning.js"
import DetailLearningModule from "views/pages/app/learnModules.js"
import Graph from "views/pages/graph.js"
import CardPage from "views/pages/CardPage";
import Forgetpass from "views/pages/auth/forgetpass";
import Confirmpassword from "views/pages/auth/confirmpassword";
import OTPVerification from "views/pages/auth/otp-verification";
import CertificateDetailsModule from "views/pages/app/certificateDetailsModuleNew"
import CeriticateSpecificDetails from "views/pages/app/certificateDetailsModule"
import UserDetails from "views/pages/app/UserDetails";
import ModuleLevelDetails from 'views/pages/app/moduleDetails'
import SubModuleDetails from 'views/pages/app/submoduleDetails'
import TopicDetails from "views/pages/app/TopicDetails";
import CertificateInfo from "views/pages/app/certificationinfo";
import DetaailSubModule from "views/pages/app/deailsubmodules"
import UnreachableUrl from 'views/pages/app/unreachableUrls'

const isUserLoggedInIsAdmin = localStorage.getItem('isAdmin')
var routes = [
  {
    path: "/index",
    name: "Certificates",
    component: <Certification />,
    layout: "/admin",
    showcomponent:true
  },
  {
    path: "/feedback",
    name: "Quiz",
    component: <Feedback />,
    layout: "/admin",
    showcomponent:false

  },
  {
    path: "/submodule-certificate-details",
    name: "Certification Sub Details",
    component: <DetaailSubModule />,
    layout: "/admin",
    showcomponent:false
    // showcomponent:isUserLoggedInIsAdmin==="true"?true:false
  },
  {
    path: "/quiz",
    name: "Quiz Mode",
    component: <Quiz />,
    layout: "/admin",
    showcomponent:false

  },
  {
    path: "/certifications",
    name: "Quiz",
    component: <Certification />,
    layout: "/admin",
    showcomponent:false
  },
  {
    path: "/certifications/details",
    name: "Certification Details",
    component: <CertificationDetail />,
    layout: "/admin",
    showcomponent:false
  },
  {
    path: "/new-certificate-details",
    name: "Certification Details",
    component: <CertificateDetailsModule />,
    layout: "/admin",
    // showcomponent:true
    showcomponent:isUserLoggedInIsAdmin==="true"?true:false
  },
  {
    path: "/unreachable-urls",
    name: "Unreachable Url ",
    component: <UnreachableUrl />,
    layout: "/admin",
    // showcomponent:true
    showcomponent:false
  },
  {
    path: "/learning/details",
    name: "Learning",
    component: <DetailLearning />,
    layout: "/admin",
    showcomponent:false

  },
  {
    path: "/learning/detailsmodule",
    name: "Learning",
    component: <DetailLearningModule />,
    layout: "/admin",
    showcomponent:false

  },
  {
    path: "/tables",
    name: "Score",
    component: <Tables />,
    layout: "/admin",
    showcomponent:true

  },
  {
    path: "/user-profile",
    name: "User Profile",
    component: <Profile />,
    layout: "/admin",
    showcomponent:false

  },
  {
    path: "/certificate-info",
    name: "User Profile",
    component: <CertificateInfo />,
    layout: "/admin",
    showcomponent:true

  },
  {
    path: "/UserDetails",
    name: "User Details",
    component: <UserDetails />,
    layout: "/admin",
    showcomponent:isUserLoggedInIsAdmin==="true"?true:false

  },
  {
    path: "/user-certificate-details",
    name: "Certificate Details7",
    component: <CeriticateSpecificDetails />,
    layout: "/admin",
    showcomponent:false 
  },
  {
    path: "/user-modules-details",
    name: "Certificate Details3",
    component: <ModuleLevelDetails />,
    layout: "/admin",
    showcomponent:false

  },{
    path: "/user-sub-modules-details",
    name: "Certificate Details4",
    component: <SubModuleDetails />,
    layout: "/admin",
    showcomponent:false
  },
  {
    path: "/user-topic-details",
    name: "Certificate Details5",
    component: < TopicDetails/>,
    layout: "/admin",
    showcomponent:false
  },

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25",
    component: <Login />,
    layout: "/auth",
    showcomponent:false
  },
  {
    path: "/recover-password",
    name: "confirm Password",
    icon: "ni ni-key-25",
    component: <Confirmpassword />,
    layout: "/route",
    showcomponent:false
  },
  {
    path: "/otp-verification",
    name: "otp verification",
    icon: "ni ni-key-25",
    component: <OTPVerification />,
    layout: "/route",
    showcomponent:false
  },
  {
    path: "/forgot-password",
    name: "forgot Password",
    icon: "ni ni-key-25",
    component: <Forgetpass />,
    layout: "/auth",
    showcomponent:false
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 ",
    component: <Register />,
    layout: "/auth",
    showcomponent:false

  },{
    path: "/payment",
    name: "Payment",
    icon: "ni ni-circle-08 ",
    component: <CardPage />,
    layout: "/admin",
    showcomponent:false

  }
];
export default routes;