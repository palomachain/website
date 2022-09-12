import { setCookie } from 'cookies-next';

Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const Ignore = () => {
    setCookie('ignore', 'true', { maxAge: 60 * 60 * 24 * 7 * 10000 });

    return (
        <div>Ignore</div>
    );
};

export default Ignore;

