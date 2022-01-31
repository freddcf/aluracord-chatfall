import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import RotateLoader from "react-spinners/RotateLoader";
import appConfig from '../config.json';
import background from '../src/img/backgroundChat.jpg';
import { ButtonSendSticker } from '../src/components/btnSendSticker';

const SUPABASE_URL = 'https://rjdctdlzpxuekrjxmdsw.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

function getRealTimeChat(messageStatus) {
  return supabaseClient
    .from('messages')
    .on('*', (response) => {
      if (response.eventType === 'INSERT') {
        console.log(response.new);
        messageStatus('INSERT', response.new)
      } else if (response.eventType === 'DELETE') {
        console.log(response.old);
        messageStatus('DELETE', response.old)
      }
    }).subscribe();
}

export default function ChatPage() {
  // Sua lógica vai aqui
  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState([]);
  const root = useRouter();
  const { username } = root.query;

  useEffect(() => {
    supabaseClient
      .from('messages')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setChatList(data);
      });

    getRealTimeChat((eventType, loadMessage) => {
      console.log(eventType);
      console.log(loadMessage);
      // supabaseClient.removeAllSubscriptions()
      if (eventType === 'INSERT') {
        setChatList((currentChatListValue) => {
          return [
            loadMessage,
            ...currentChatListValue,
          ]
        });
      } else if (eventType === 'DELETE') {
        setChatList((currentChatListValue) => {
          return (
            currentChatListValue.filter((messageAtual) => {
              return messageAtual.id != loadMessage.id;
            })
          )
        })
      }
    });
  }, []);


  // fetch(`https://api.github.com/users/freddcf`).then(async (serverInfo) => {
  //   const info = await serverInfo.json();
  // })

  function handleNewMessage(newMessage) {
    const message = {
      // id: chatList.length + 1,
      de: username,
      texto: newMessage,
    };

    supabaseClient
      .from('messages')
      .insert([message])
      .then();
    setMessage('');
  }

  function deleteMessage(event) {
    const msgId = Number(event.target.dataset.id);

    chatList.forEach((message) => {
      if (message.id === msgId && message.de === username)
        supabaseClient
          .from('messages')
          .delete()
          .match({ id: msgId })
          .then()
    })
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
          opacity: '0.95',
          height: '100%',
          maxWidth: { xs: '95%', sm: '95%', lg: '70%' },
          maxHeight: '95vh',
          padding: { xs: '10px 12px', sm: '17px 19px', lg: '24px 26px' },
        }}
      >
        <Header username={username} />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: { xs: '8px', sm: '16px' },
            marginBottom: { xs: '12px', sm: '20px', lg: '28px' },
            overflow: 'hidden',
          }}
        >
          <MessageList messages={chatList} deleteMessage={deleteMessage} username={username} />
        </Box>
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
                if (message) handleNewMessage(message);
              }
            }}
            placeholder="Inserir mensagem..."
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
          {/* Callback */}
          <ButtonSendSticker
            onStickerClick={(sticker) => {
              console.log('Usando o componente');
              handleNewMessage(`:sticker:${sticker}`)
            }}
          />
          <Button
            label='Enviar'
            size='sm'
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
            onClick={() => { if (message) handleNewMessage(message) }}
          />
        </Box>
      </Box>
    </Box>
  )
}

function Header(props) {
  const username = props.username;
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: { xs: '6px', sm: '10px', lg: '16px' }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat Fall -
          <Text variant='heading5'
            styleSheet={{
              marginLeft: '10px',
            }}
          >#{username}</Text>
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
  const [loading, setLoading] = useState('');
  const deleteMessage = props.deleteMessage;
  const username = props.username;
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  }, [])

  return (

    <Box
      tag="ul"
      styleSheet={{
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      {
        loading ?
          <Box
            styleSheet={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <RotateLoader
              color={'#29A39B'}
              loading={loading}
              size={20}
              styleSheet={{
                alignSelf: 'center',
                justifySelf: 'center'
              }}
            />

          </Box>
          :

          props.messages.map((message) => {
            return (
              <Text className='hoveredMessage'
                key={message.id}
                tag="li"
                styleSheet={{
                  fontSize: { xs: '12px', sm: '16px' },
                  borderRadius: '5px',
                  padding: '6px',
                  marginBottom: '10px',
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
                      marginBottom: { xs: '2px', sm: '8px' },
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
                      src={`https://github.com/${message.de}.png`}
                    />
                    <Text tag="strong"
                      styleSheet={{
                        fontSize: { xs: '12px', sm: '16px' },
                      }}
                    >
                      {message.de}
                    </Text>
                    <Text
                      styleSheet={{
                        fontSize: '11px',
                        marginLeft: '8px',
                        color: appConfig.theme.colors.neutrals[300],
                      }}
                      tag="span"
                    >
                      {(new Date(message.created_at).toLocaleDateString('pt-BR', options))}
                    </Text>
                  </Box>
                  <Box className={message.de === username ? "trashIcon" : ''}
                    data-id={message.id}
                    onClick={deleteMessage}
                    styleSheet={{
                      display: 'inline-block',
                      color: 'transparent',
                      alignSelf: 'center',
                      transition: '.4s ease',
                      marginRight: '8px',
                    }}
                  >
                    <Icon
                      name={"FaTrash"}
                      styleSheet={{
                        width: { xs: '13px', sm: '14px' },
                        height: { xs: '13px', sm: '14px' },
                        pointerEvents: 'none',
                      }}
                    />
                  </Box>
                </Box>
                {message.texto.startsWith(':sticker:')
                  ? (
                    <Image
                      height='100px'
                      width='100px'
                      src={message.texto.replace(':sticker:', '')}
                    />
                  )
                  : (
                    message.texto
                  )}
                {/* {message.texto} */}
              </Text>
            );
          })
      }

    </Box>
  )
}