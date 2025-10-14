import { Alert, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ErrorDisplay = ({ error, onRetry }) => {
    const isApiError = error?.response?.status;
    
    const getErrorMessage = () => {
        if (isApiError) {
            switch (error.response.status) {
                case 401:
                    return 'Oturum süreniz dolmuş olabilir. Lütfen yeniden giriş yapın.';
                case 403:
                    return 'Bu işlem için yetkiniz bulunmuyor.';
                case 404:
                    return 'İstenen kaynak bulunamadı.';
                case 500:
                    return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
                default:
                    return error.message || 'Bir hata oluştu';
            }
        }
        return error?.message || 'Beklenmeyen bir hata oluştu';
    };

    return (
        <Alert 
            severity="error"
            action={
                onRetry && (
                    <Button 
                        color="inherit" 
                        size="small"
                        onClick={onRetry}
                    >
                        Yeniden Dene
                    </Button>
                )
            }
        >
            <Typography variant="subtitle2">
                {getErrorMessage()}
            </Typography>
        </Alert>
    );
};

ErrorDisplay.propTypes = {
    error: PropTypes.object.isRequired,
    onRetry: PropTypes.func
};

export default ErrorDisplay; 
