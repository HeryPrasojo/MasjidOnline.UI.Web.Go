const moGeoLocation = {};

(() =>
{
    moGeoLocation.latitude = null;
    moGeoLocation.longitude = null;
    moGeoLocation.precision = null;
    moGeoLocation.altitude = null;
    moGeoLocation.altitudePrecision = null;
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(onGetCurrentPositionSuccess, onGetCurrentPositionError, { enableHighAccuracy: true, });
    }

    function onGetCurrentPositionSuccess(position)
    {
        moGeoLocation.latitude = position.coords.latitude;
        moGeoLocation.longitude = position.coords.longitude;
        moGeoLocation.precision = position.coords.accuracy;
        moGeoLocation.altitude = position.coords.altitude;
        moGeoLocation.altitudePrecision = position.coords.altitudeAccuracy;
    }

    function onGetCurrentPositionError(error)
    {
    }

})();
