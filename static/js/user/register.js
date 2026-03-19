(async () =>
{
    mo.authorizeAnonymous();

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const formElement = mo.getElementById('registerForm');
        const emailElement = mo.getElementById('emailInput');
        const messageElement = mo.getElementById('messageElement');
        const submitElement = mo.getElementById('submitButton');

        const messageColor = messageElement.style.color;

        submitElement.addEventListener('click', submitForm);

        async function submitForm()
        {
            if (!formElement.reportValidity()) return;


            const email = emailElement.value;

            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            messageElement.style.color = messageColor;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            try
            {
                const json = await mo.fetchRegister({
                    Contact: email,
                    ContactType: 1,
                });

                if (json.ResultCode) return showError(json.ResultMessage);

                messageElement.textContent = 'We have sent verification link to the email address. Please follow the link to continue signing up. The link will be expired within 16 minutes.';

                submitElement.classList.toggle("loading");
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
