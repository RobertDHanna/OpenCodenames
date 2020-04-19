import React from 'react';
import Lobby from './Lobby';
import Board from './Board';
import useQuery from './hooks/useQuery';
import useWebSocket from './hooks/useWebSocket';
import usePlayerID from './hooks/userPlayerID';

function Game() {
  const query = useQuery();
  const spectate = query.has('spectate');
  const gameID = query.get('gameID');
  // const isSpectator = query.has('spectate');
  const [game, setGame] = React.useState<Game | null>(null);
  const playerID = usePlayerID();
  const [connected, incomingMessage, sendMessage] = useWebSocket({
    webSocketUrl: spectate
      ? `ws://${window.location.host}/ws/spectate?gameID=${gameID}`
      : `ws://${window.location.host}/ws?gameID=${gameID}&playerID=${playerID}`,
    skip: typeof gameID !== 'string' && !spectate && playerID !== null,
  });
  React.useEffect(() => {
    setGame(incomingMessage);
  }, [incomingMessage]);
  if (typeof gameID !== 'string') {
    return <div>Invalid URL</div>;
  }
  if (game === null || !connected) {
    return <div>Loading</div>;
  }
  switch (game?.Status) {
    case 'pending': {
      return <Lobby game={game} sendMessage={sendMessage} />;
    }
    case 'running':
    case 'redwon':
    case 'bluewon': {
      return <Board game={game} sendMessage={sendMessage} />;
    }
    default: {
      return <div>Unknown Game State {JSON.stringify(game)}</div>;
    }
  }
}

export default Game;
