import { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { setStorageValue, getStorageValue, STORAGE_KEYS } from 'utils/storage';
import { FormattedMessage } from 'react-intl';

const Settings = () => {
    const [pat, setPat] = useState(getStorageValue(STORAGE_KEYS.PAT, ''));
    const [organization, setOrganization] = useState(getStorageValue(STORAGE_KEYS.ORGANIZATION, ''));

    const handleSubmit = (e) => {
        e.preventDefault();
        setStorageValue(STORAGE_KEYS.PAT, pat);
        setStorageValue(STORAGE_KEYS.ORGANIZATION, organization);
        window.location.reload(); // Sayfayı yenile
    };

    return (
        <Stack direction="row" spacing={2} component="form" onSubmit={handleSubmit} sx={{ width: '100%', px: 2 }}>
            <TextField
                size='small'
                fullWidth
                label="Organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}

            />
            <TextField
                size='small'
                fullWidth
                label="PAT"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                type="password"
            />
            <Button size='small' type="submit" variant="outlined">
                <FormattedMessage id="save" />
            </Button>
        </Stack>
    );
};

export default Settings; 
