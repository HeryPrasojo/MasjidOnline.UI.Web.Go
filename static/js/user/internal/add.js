(() =>
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    document.addEventListener("moLayoutChanged", onDOMContentLoaded);


    function onDOMContentLoaded()
    {
        const formElement = mo.getElementById('addForm');
        const contactElement = mo.getElementById('contactInput');
        const messageElement = mo.getElementById('addMessage');
        const submitElement = mo.getElementById('addButton');

        const messageColor = messageElement.style.color;

        submitElement.addEventListener('click', submitForm);

        async function submitForm()
        {
            if (!formElement.reportValidity()) return;


            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            messageElement.style.color = messageColor;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            try
            {
                const json = await moHub.sendUserInternalAdd({ Contact: contactElement.value });

                if (json.ResultCode) return showError(json.ResultMessage);


                messageElement.textContent = 'Success, redirecting...';
                messageElement.classList.toggle("loading");

                submitElement.classList.toggle("loading");

                location.href = '/user/internal/list';
            }
            catch (err)
            {
                console.error(err);

                showError(err.message);
            }

            function showError(e)
            {
                submitElement.classList.toggle("loading");
                submitElement.disabled = false;

                messageElement.textContent = e;
                messageElement.style.color = 'red';
            }
        }
    }
})();
