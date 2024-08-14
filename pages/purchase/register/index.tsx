import Describe from '../describe';
import RegisterFlow from './registration';

const Register = () => {
  return (
    <div className="page-container light-node-sale">
      <div className=" purchase-flow-page">
        <Describe />
        <RegisterFlow />
      </div>
    </div>
  );
};

export default Register;
