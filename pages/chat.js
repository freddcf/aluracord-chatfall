import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import { useState } from 'react';
import appConfig from '../config.json';
import background from '../img/backgroundChat.jpg';

export default function ChatPage() {
  // Sua lógica vai aqui
  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState([]);

  function handleNewMessage(newMessage) {
    const message = {
      id: chatList.length + 1,
      from: 'freddcf',
      text: newMessage,
    };
    setChatList([
      message,
      ...chatList,
    ]);
    setMessage('');
  }

  function deleteMessage(event) {
    const msgId = Number(event.target.dataset.id);
    console.log(msgId);
    const chatFiltered = chatList.filter(message => message.id != msgId);
    return setChatList(chatFiltered);
  }

  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.neutrals['000'],
        backgroundImage: `url(${background.src})`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000'],
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          opacity: '0.8',
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList messages={chatList} deleteMessage={deleteMessage} />
          {/* {chatList.map((currentMessage) => {
            return (
              <li key={currentMessage.id}>
                {currentMessage.from}: {currentMessage.text}
              </li>
            )
          })} */}
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={message}
              onChange={(event) => {
                const valor = event.target.value;
                setMessage(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  if(message) handleNewMessage(message);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              label='Enviar'
              size='lg'
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[500],
              }}
              styleSheet={{
                disabled: {},
                focus: {},
                hover: {
                  cursor: 'pointer',
                },
                padding: '11.5px 12px',
                marginBottom: '8px',
              }}
              onClick={() => {if(message) handleNewMessage(message)}}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat - Dev Falls
        </Text>
        <Button
        styleSheet={{
          color: appConfig.theme.colors.neutrals["100"],
        }}
          variant='tertiary'
          colorVariant='neutral'
          label='Log out'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {

  const deleteMessage = props.deleteMessage;

  console.log('MessageList', props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >

      {props.messages.map((message) => {
        return (
          <Text className='hoveredMessage'
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
              wordBreak: 'break-word',
            }}
          >
            <Box
              styleSheet={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >

              <Box
                styleSheet={{
                  marginBottom: '8px',
                }}
              >
                <Image
                  styleSheet={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                  src={`https://github.com/${message.from}.png`}
                />
                <Text tag="strong">
                  {message.from}
                </Text>
                <Text
                  styleSheet={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {(new Date().toLocaleDateString())}
                </Text>
              </Box>
              <Box className="trashIcon"
                data-id={message.id}
                onClick={deleteMessage}
                styleSheet={{
                  // margin: '15px',
                  display: 'inline-block',
                  position: 'absolute',
                  width: '14px',
                  height: '14px',
                  color: appConfig.theme.colors.neutrals[600],
                  alignSelf: 'center',
                  right: '0px',
                  transition: '.6s ease'
                }}
              >
                <Icon
                  name={"FaTrash"}
                  styleSheet={{
                    width: '100%',
                    pointerEvents: 'none',
                  }}
                />
              </Box>
            </Box>
            {message.text}
          </Text>
        );
      })}
    </Box>
  )
}