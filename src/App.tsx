import * as React from 'react';
import './App.css';

function App() {
  //

  const mapsRef = React.useRef<google.maps.Map | null>(null);
  const circleRef = React.useRef<google.maps.Circle | null>(null);

  const [radius, setRadius] = React.useState(500);

  const [position, setPosition] = React.useState({
    lat: 0,
    lng: 0,
  });

  React.useEffect(() => {
    //
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        mapsRef.current?.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }

    mapsRef.current = new window.google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: position,
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
      },
    );

    circleRef.current = new window.google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      map: mapsRef.current,
      center: position,
      editable: true,
      draggable: true,
    });

    const dragendSubscription = circleRef.current.addListener(
      'dragend',
      (event: any) => {
        //
        setPosition({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
      },
    );

    circleRef.current.addListener('radius_changed', () => {
      setRadius(circleRef.current?.getRadius() || 0);
      console.log(circleRef.current?.getRadius());
    });

    return () => {
      dragendSubscription.remove();
    };
    //
  }, []);

  React.useEffect(() => {
    circleRef.current?.setRadius(radius);
  }, [radius]);

  React.useEffect(() => {
    circleRef.current?.setCenter(position);
  }, [position]);

  return (
    <div>
      <div id="map" style={{ height: '100vh', width: '100%' }}></div>
      <input
        style={{ position: 'absolute', top: 0, left: 0, width: '50%' }}
        type="range"
        min="500"
        max="100000"
        value={radius}
        onChange={e => {
          setRadius(+e.target.value);
        }}
      />
    </div>
  );
}

export default App;
