const moStorage = {};

(() =>
{
    const recommendationNoteStorageKey = 'recommendationNote';
    const sessionIdStorageKey = 'sessionId';


    moStorage.removeRecommendationNote = () =>
    {
        localStorage.removeItem(recommendationNoteStorageKey);
    };

    moStorage.getRecommendationNote = () =>
    {
        return localStorage.getItem(recommendationNoteStorageKey);
    }

    moStorage.setRecommendationNote = (note) =>
    {
        localStorage.setItem(recommendationNoteStorageKey, note);
    }


    moStorage.getSession = () =>
    {
        return localStorage.getItem(sessionIdStorageKey);
    };

    moStorage.removeSession = () =>
    {
        localStorage.removeItem(sessionIdStorageKey);
    };

    moStorage.setSession = (id) =>
    {
        localStorage.setItem(sessionIdStorageKey, id);
    }

})();
