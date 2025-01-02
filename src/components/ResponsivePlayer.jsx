import React from 'react';
import ReactPlayer from 'react-player';

const ResponsivePlayer = ({ url }) => (
  <div style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 */ }}>
    <ReactPlayer
      url={url}
      controls
      width='100%'
      height='100%'
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  </div>
);

export default ResponsivePlayer;
