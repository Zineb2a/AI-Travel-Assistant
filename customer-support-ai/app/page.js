'use client';

import { Box, Button, Stack, TextField, Typography, useTheme, ThemeProvider, createTheme } from '@mui/material';
import { useState, useRef, useEffect } from 'react';


// Custom theme with blue colors for other components
const theme = createTheme({
  palette: {
    primary: {
      main: '#29b6f6', // Light Blue
    },
    secondary: {
      main: '#03dac6', // Cyan 03dac6
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
        },
      },
    },
  },
});

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your travel assistant. I'll help you make sure you're fully prepared for your trip. From packing to documents, I'll guide you every step of the way. Ready to get started?",
    },
  ]);
  

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    const newMessage = { role: 'user', content: message };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, newMessage]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: '' },
      ]);

      let assistantMessage = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        assistantMessage += chunkText;

        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1 && msg.role === 'assistant'
              ? { ...msg, content: assistantMessage }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
        }}
      >
        {/* Header with logo and title */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '700px',
            p: 2,
            backgroundColor: 'primary.main',
            color: 'white',
            textAlign: 'center',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" fontWeight="bold">
  <img src="https://i.ibb.co/QCxrxfy/logo.png" alt="Logo" style={{ width: '40px', marginRight: '10px', verticalAlign: 'middle' }} />
  Am I Ready to Go ?
</Typography>
        </Box>

        {/* Main chat container */}
        <Stack
          direction="column"
          width="100%"
          maxWidth="700px"
          height="70vh"
          bgcolor="white"
          boxShadow="0px 8px 24px rgba(0, 0, 0, 0.15)"
          borderRadius={4}
          p={3}
          spacing={3}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            sx={{
              padding: 2,
              borderRadius: '8px',
              boxShadow: 'inset 0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  sx={{
                    backgroundColor:
                      message.role === 'assistant' ? 'primary.main' : 'secondary.main', // Keep the original colors
                    color: 'white',
                    borderRadius: '16px',
                    p: 2,
                    maxWidth: '75%',
                    wordWrap: 'break-word',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Type a message..."
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={isLoading}
              sx={{
                width: '100px',
                height: '56px',
                background: 'linear-gradient(135deg, #1e88e5, #29b6f6)',
                color: 'white',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e88e5, #0288d1)',
                },
              }}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </Stack>
        </Stack>

        {/* Footer with reserved rights */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            p: 2,
            textAlign: 'center',
            mt: 2,
            color: '#555',
          }}
        >
          <Typography variant="body2">
            © 2024 Am I Ready to Go App. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
