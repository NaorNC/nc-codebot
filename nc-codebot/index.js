const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "USER", "REACTION"] });
const { token, prefix, logo, hex_color, community_name, role_access_id, code_length, numbers_in_code, database_host, database_user, database_password, database_base } = require('./config.json');
var mysql = require('mysql')

var con = mysql.createConnection({
    host: database_host,
    user: database_user,
    password: database_password,
    database: database_base
})
con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL connected!")
})

function createCode(code, type, amount) {
            var sql = "INSERT INTO ncodes (code, type, amount) VALUES('" + code + "', '" + type + "', '" + amount + "')";
            con.query(sql, function (result){
            if (result) { console.log(result) }
            console.log("Code Created Successfully")
    });
}

function sendSuccsess(fromUser, toUser, code, type, amount, chnl, toUserUN) {

    const MadePrivateEmbed = new Discord.MessageEmbed()
	.setColor(hex_color)
    .setTitle('The code has been successfully made.')
    .setFooter("RED")
    .addFields(
		{ name: 'Code:', value: code},
        { name: 'Type:', value: type, inline: true },
        { name: 'Amount:', value: amount, inline: true },
	)
	.setAuthor(community_name + " Redeem System [By NC]", logo)
	.setTimestamp()

    toUser.send(MadePrivateEmbed);

    const MadeEmbed = new Discord.MessageEmbed()
	.setColor(hex_color)
    .setTitle('The code has been successfully made.')
	.setDescription(fromUser + ' Created a code to ' + toUserUN)
	.setAuthor(community_name + " Redeem System [By NC]", logo)
	.setTimestamp()

    chnl.send(MadeEmbed);
}

function randomString() {
    var result = '';
    var length = code_length;
    if (numbers_in_code) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    else {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function sendusage(chnl) {
    const sendusage = new Discord.MessageEmbed()
	.setColor(hex_color)
	.setTitle('Usage - !create @User | Cash/Item | Amount')
	.setAuthor(community_name + " Redeem System [By NC]", logo)
	.setTimestamp()

    chnl.send(sendusage);
}

client.on('ready', () => {
    console.log(`${community_name} Bot Online!`);
});

client.on('message', async message => {
if(message.author.bot) return;
if(message.content.indexOf(prefix) !== 0) return;

const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

if(command == "create") {
if(!message.member.roles.cache.has(role_access_id)) return;
message.delete()
const toUser = message.mentions.members.first()
const fromUser = message.author.username
const toUserUN = message.mentions.users.first()
if(toUserUN == undefined)return sendusage(message.channel);
if(args[1] == undefined)return sendusage(message.channel);
const type = args[1].toLowerCase()
const amount = args[2]
if(toUser == undefined) return sendusage(message.channel);
if(type == undefined) return sendusage(message.channel);
console.log(type)
if(amount < 1) return sendusage(message.channel);
var code = randomString();
createCode(code, type, amount)
sendSuccsess(fromUser, toUser, code, type, amount, message.channel, toUserUN)


let logs = client.channels.cache.get('Put Here Your Channel ID')
let embed = new Discord.MessageEmbed()
.setAuthor("Code Created", message.guild.iconURL({dynamic:true}))
.setColor("RED")
.addFields(
{ name: "Code For Use:", value: code, inline: true},
{ name: "Type of Code:", value: type, inline: true},
{ name: "Amount:", value: amount, inline: true},
{ name: "User:", value: toUser, inline: true},
{ name: "Created By:", value: message.author, inline: true},
)
.setFooter(message.guild.name)
logs.send(embed)
}
})



client.login(token);