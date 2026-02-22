const moForm = {};

(() =>
{
    moForm.setCustomValidity = (el, os) =>
    {
        var cv = '';

        os.forEach((o, i) => 
        {
            if (!o.fn(el.value)) cv = cv ? (cv + '\n- ' + o.m) : ('- ' + o.m);
        });

        el.setCustomValidity(cv);

        el.reportValidity();
    };

    moForm.setFileCustomValidity = (el, maxLength, maxSize) =>
    {
        var cv = (el.files.length > maxLength) ? `- Maximum number of files is ${maxLength}` : '';

        for (const file of el.files)
        {
            if (file.size > maxSize)
            {
                const m = `Maximum file size is ${maxSize} bytes: ${file.name}`;

                cv = cv ? (cv + '\n- ' + m) : ('- ' + m);
            }
        }

        el.setCustomValidity(cv);

        el.reportValidity();
    };

})();
