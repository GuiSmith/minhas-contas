import { floatToBRL } from '@utils/formats';

const DashCard = ({ title, iconClass, amount, text, textClass }) => {
    {/* Total a pagar */ }
    return (
        <div className='card shadow-sm rounded-3'>
            <div className='card-body'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                    <span className='text-muted fw-medium'>{title}</span>
                    <i className={`bi ${iconClass} ${textClass}`}></i>
                </div>
                <h4 className={`fw-semibold mb-1 ${textClass}`}>R$ {floatToBRL(amount)}</h4>
                <small className="text-muted">{text}</small>
            </div>
        </div>
    )
}

export default DashCard;