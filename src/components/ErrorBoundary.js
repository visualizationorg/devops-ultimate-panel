import React, { useState, useCallback } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

// Fonksiyonel wrapper component
const ErrorBoundaryWrapper = ({ children, onReset, showErrorDetails = process.env.NODE_ENV === 'development' }) => {
    const [error, setError] = useState(null);

    const handleReset = useCallback(() => {
        setError(null);
        onReset?.();
    }, [onReset]);

    if (error) {
        return (
            <Stack spacing={2} alignItems="center" sx={{ p: 3 }}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Bir hata oluştu
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {error?.message || 'Beklenmeyen bir hata oluştu'}
                    </Typography>
                    {showErrorDetails && error?.componentStack && (
                        <pre style={{ 
                            whiteSpace: 'pre-wrap',
                            fontSize: '0.875rem',
                            marginBottom: '1rem'
                        }}>
                            {error.componentStack}
                        </pre>
                    )}
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleReset}
                        >
                            Yeniden Dene
                        </Button>
                        <Button 
                            variant="outlined"
                            onClick={() => window.location.reload()}
                        >
                            Sayfayı Yenile
                        </Button>
                    </Stack>
                </Alert>
            </Stack>
        );
    }

    return children;
};

// ErrorBoundary'yi class component olarak yazmamın sebebi, React'in hata yakalama özelliğinin (error boundary) sadece class component'larda çalışmasıdır. 
// React ekibi, React 18'de bile bu kısıtlamayı değiştirmedi. 
// React'in resmi dokümantasyonunda da belirtildiği gibi (https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary), error boundary'ler şu an için sadece class component'lar ile oluşturulabilir. 
// Bunun sebebi getDerivedStateFromError ve componentDidCatch lifecycle metodlarının sadece class component'larda bulunmasıdır.

// Class error boundary (gerekli)
class ErrorBoundary extends React.Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        // Hata loglama servisi entegrasyonu buraya eklenebilir
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        
        // Hata bilgisini state'e ekle
        this.setState({
            error: {
                ...error,
                componentStack: errorInfo.componentStack
            }
        });
    }

    render() {
        return (
            <ErrorBoundaryWrapper
                error={this.state.error}
                onReset={() => this.setState({ error: null })}
                showErrorDetails={this.props.showErrorDetails}
            >
                {this.props.children}
            </ErrorBoundaryWrapper>
        );
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    onReset: PropTypes.func,
    showErrorDetails: PropTypes.bool
};

ErrorBoundary.defaultProps = {
    showErrorDetails: process.env.NODE_ENV === 'development'
};

export default ErrorBoundary; 