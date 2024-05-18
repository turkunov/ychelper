async function getTestsFromPage() {
    /*
    Функция, собирающая программные тесты на страницы
    задачи в список из кортежей по типу [([ввод_1, ввод_2],вывод)]
    */

    let [tab] = await chrome.tabs.query({ active: true })
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: () => {
            let copyToClipboard = (text) => {
                var dummy = document.createElement("textarea");
                document.body.appendChild(dummy);
                dummy.value = text;
                dummy.select();
                document.execCommand("copy");
                document.body.removeChild(dummy);
            };

            try {
                pres = document.getElementsByTagName("pre");
                let codeExmps = [];
                for(pre of pres){
                    let matches = [...pre.innerText.matchAll(/\<\/[a-z]*\>/g)];
                    if (matches.length<1) {
                        codeExmps.push(pre.innerText);
                    };
                };
                codeExmps = codeExmps.filter(exmp => exmp.length > 0)
                if (codeExmps.length < 1) {
                    throw new Error('');
                }
                let pyString = "test_cases = [";
                for(let i = 0;i<codeExmps.length-1;i+=2){
                    pyString += `([${codeExmps[i].split("\n").filter((substr => substr.length > 0)).map(substr => "'"+substr+"'")}],[${codeExmps[i+1].split("\n").filter((substr => substr.length > 0)).map(substr => "'"+substr+"'")}]),`
                }
                pyString += "]"
                copyToClipboard(pyString);
                alert('[v] тесты сохранены в буфер')
            } catch (err) {
                alert('[х] на странице не найдены тесты')
            }
        }
    })
};

document.getElementById("copyTests").addEventListener(
    "click", 
    getTestsFromPage
);