class App {
    constructor() {
        this.convert();
    }

    convert() {
        const split = $('body')
            .html()
            .split('aHR0');

        let html = split[0];
        let links = [];

        for (let index = 1; index < split.length; index++) {
            const text = split[index];
            let end;

            for (let index1 = 0; index1 < text.length; index1++) {
                const char = text[index1];
                if (!this.isValidCharacter(char)) {
                    end = index1;
                    break;
                }
            }

            const startText = text.substring(0, end);
            const payload = 'aHR0' + startText;
            const utf8 = atob(payload);
            if (this.isValidLink(utf8)) {
                links.push({
                    base64: payload,
                    link: utf8,
                    regex: new RegExp(payload, 'g')
                });
            }
        }

        this.replaceInHtml(links);
    }

    replaceInHtml(links) {
        $('body :not(script):not(style):not(input):not(link)')
            .contents()
            .filter(function() {
                return this.nodeType;
            })
            .filter(function() {
                return (
                    links.filter(
                        data => !!this.nodeValue && this.nodeValue.indexOf(data.base64) > -1
                    ).length > 0
                );
            })
            .replaceWith(function() {
                let text = this.nodeValue;

                links.map(data => {
                    if (text.indexOf(data.base64) > -1) {
                        text = text.replace(
                            data.regex,
                            `<a href="${data.link}" target="_blank" rel="nofollow noreferrer">${
                                data.link
                            }</a>`
                        );
                    }
                });
                return text;
            });
    }

    isValidLink(text) {
        const regex = text.match(/^[a-z]*:\/\//);
        return !!regex && regex.length;
    }

    isValidCharacter(text) {
        const regex = text.match(/^[A-Za-z0-9=+\/]/);
        return !!regex && regex.length;
    }
}

new App();
