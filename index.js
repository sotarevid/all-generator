const LOGIN = '';
const PASSWORD = '';

const rl = require('readline-sync');
const easyvk = require('easyvk');
const fs = require('fs');

const captchaHandler = ({ captcha_sid, captcha_img, resolve: solve, vk }) => {

    let answer = rl.question(`Введите капчу для картинки ${captcha_img} `);

    solve(answer).then(() => {
        console.log('Капча решена корректно!');
    }).catch(({ err, reCall: tryNewCall }) => {
        console.log('Капче не решена!!!\nПробуем заново');
        tryNewCall();
    });
}

easyvk({
    captchaHandler: captchaHandler,
    username: LOGIN,
    password: PASSWORD
}).then(async vk => {
    let response = await vk.call('messages.getConversationMembers', {
        peer_id: 2000000000 + Number.parseInt(rl.question("chat_id: "))
    })

    try {
        response = JSON.parse(response);
    }
    catch (error) {

    }

    let result = "";
    response.profiles.forEach(profile => {
        result += `@${profile.screen_name}, `;
    });

    fs.writeFileSync("output.txt", result);
    console.log(response.count);
}).catch(console.error)