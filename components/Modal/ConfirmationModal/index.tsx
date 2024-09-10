import Modal from 'components/Modal';
import style from './confirmationModal.module.scss';

interface IConfirmationModal {
  email: string;
  setConfirm: (e: boolean) => void;
}

const ConfirmationModal = ({ email, setConfirm }: IConfirmationModal) => {
  return (
    <Modal className={style.confirmEmail} contentClassName={style.contentClassName}>
      <img className={style.loadingImage} src="/assets/icons/confirm-email.svg" alt="confirm-email" />
      <h3 className={style.title}>Check your Email</h3>
      <p className={style.text}>
        We emailed a magic link to
        <br />
        <b>{email}</b>
        <br />
        Click the link to confirm your email
      </p>
      <p className={style.subText}>If you haven't received an email after a minute.</p>
      <span className={style.clickAgain} onClick={() => setConfirm(false)}>
        Click here to try again.
      </span>
    </Modal>
  );
};

export default ConfirmationModal;
