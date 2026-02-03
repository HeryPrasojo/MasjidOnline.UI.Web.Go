(() =>
{
    if (document.readyState === "complete")
        onLoaded();
    else
        window.addEventListener('load', onDOMContentLoaded);

    async function onDOMContentLoaded()
    {
        var recommendationNote = moStorage.getRecommendationNote();

        if (!recommendationNote)
        {
            const json = await moFetch.fetchRecommendationNote();

            if (json.ResultCode) return await moDialog.showModal('Error: ' + json.ResultMessage);

            recommendationNote = json.Data;

            moStorage.setRecommendationNote(recommendationNote);
        }

        const recommendationNoteElement = mo.getElementById('recommendationNote');

        recommendationNoteElement.classList.toggle("loading");

        recommendationNoteElement.textContent = 'MO Infaq ' + recommendationNote;
    }

})();
