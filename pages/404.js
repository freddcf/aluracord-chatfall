import { Box, Button, Text, Image } from '@skynexui/components';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import errorImage from '../img/img404.png';

export default function notFound() {
  const root = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        }}
      >

        <Text styleSheet={{
          fontSize: '1.8rem',
          fontWeight: '600',
        }}>ERROR</Text>

        <Image
          styleSheet={{
            maxHeight: { xs: '40vh', sm: '50vh' },
            padding: { xs: '20px 30px', sm: '5px 5px' }
          }}
          src={errorImage.src}
        />

        <Text styleSheet={{ fontSize: { xs: '18px', sm: '25px' }, fontWeight: '600', margin: '2% 2% 1%', color: appConfig.theme.colors.neutrals[300] }}>
          !PAGE NOT FOUND!
        </Text>

        <Text styleSheet={{ fontSize: { xs: '12px', sm: '18px' }, textAlign: 'center', margin: '0% 2% 2%', color: appConfig.theme.colors.neutrals[300] }}>
          Olha só... Parece que alguém aqui gosta de bisbilhotar.
        </Text>

        <Button
          buttonColors={{
            contrastColor: appConfig.theme.colors.neutrals["050"],
            mainColor: appConfig.theme.colors.primary[500],
            mainColorLight: appConfig.theme.colors.primary[400],
            mainColorStrong: appConfig.theme.colors.primary[600],
          }}
          label="Go Home"
          variant="secondary"
          rounded="sm"
          size="lg"
          styleSheet={{
            disabled: {},
            focus: {},
            hover: {
              cursor: 'pointer'
            },
            margin: { xs: '10%', sm: '2%' },
          }}
          onClick={(event) => root.push("/")}
        />
      </Box>
    </>
  )
}