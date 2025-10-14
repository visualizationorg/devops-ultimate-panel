import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { alpha } from '@mui/material/styles';
import * as Diff from 'diff';

const DiffViewer = ({ oldContent = '', newContent = '' }) => {
    const theme = useTheme();
    const diff = Diff.diffLines(oldContent, newContent);

    return (
        <Box sx={{ 
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: '500px'
        }}>
            {diff.map((part, index) => {
                const backgroundColor = part.added 
                    ? alpha(theme.palette.success.main, 0.1)
                    : part.removed
                        ? alpha(theme.palette.error.main, 0.1)
                        : 'transparent';
                
                const borderColor = part.added 
                    ? theme.palette.success.main
                    : part.removed
                        ? theme.palette.error.main
                        : 'transparent';

                return (
                    <Box
                        key={index}
                        sx={{
                            backgroundColor,
                            borderLeft: `4px solid ${borderColor}`,
                            padding: '4px 8px',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        <SyntaxHighlighter
                            language="javascript"
                            style={tomorrow}
                            customStyle={{
                                margin: 0,
                                background: 'transparent'
                            }}
                        >
                            {part.value}
                        </SyntaxHighlighter>
                    </Box>
                );
            })}
        </Box>
    );
};

export default DiffViewer; 
