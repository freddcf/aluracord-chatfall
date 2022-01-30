import Head from "next/head";
import appConfig from '../config.json';

function GlobalStyle() {
  return (
    <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }
      body {
        font-family: 'Open Sans', sans-serif;
      }
      /* App fit Height */ 
      html, body, #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }
      .hoveredMessage:hover .trashIcon {
        color: ${appConfig.theme.colors.neutrals[300]};
        cursor: pointer;
      }
      ::-webkit-scrollbar-track {
        background-color: ${appConfig.theme.colors.neutrals[500]};
      }
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-thumb {
        background: ${appConfig.theme.colors.neutrals[300]};
      }
      /* ./App fit Height */ 
    `}</style>
  );
}

export default function MyApp({ Component, pageProps }) {
  console.log('roda em todo cantoooo');
  return (
    <>
      <GlobalStyle/><Head>
        <title>DevFalls</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}