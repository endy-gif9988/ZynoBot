let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let oldName = metadata.subject;
        let newName = `${oldName} | 𝑺𝑽𝑻 𝑩𝒀 |̲̅̅E̲̅̅|̲̅̅N̲̅̅|̲̅̅D̲̅̅|̲̅̅Y̲̅̅`;
        await conn.groupUpdateSubject(m.chat, newName);
    } catch (e) {
        console.error('Errore cambio nome gruppo:', e);
    }

    // 🔹 RESET LINK GRUPPO
    let newInviteLink = '';
    try {
        await conn.groupRevokeInvite(m.chat); // invalida il vecchio link
        let code = await conn.groupInviteCode(m.chat); // prende il nuovo codice
        newInviteLink = `https://chat.whatsapp.com/${code}`;
    } catch (e) {
        console.error('Errore reset link:', e);
    }

    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.jid);

    await conn.sendMessage(m.chat, {
        text: ""𝒍𝒂𝒔𝒄𝒊𝒂 𝒄𝒉𝒆 𝒊𝒍 𝒗𝒆𝒏𝒕𝒐 𝒗𝒊 𝒔𝒑𝒂𝒛𝒛𝒊 𝒗𝒊𝒂 𝒄𝒐𝒎𝒆 𝒖𝒏𝒂 𝒑𝒊𝒖𝒎𝒂,𝒂𝒃𝒃𝒂𝒊𝒂𝒕𝒆 𝒅𝒂𝒗𝒂𝒏𝒕𝒊 𝐨𝐛𝐞𝐫𝐲𝐚...""
    });

    await conn.sendMessage(m.chat, {
        text: `𝑶𝑹𝑨 𝑬𝑵𝑻𝑹𝑨𝑻𝑬 𝑻𝑼𝑻𝑻𝑰 𝑸𝑼𝑰:\n\ 𝑽𝒊 𝒂𝒔𝒑𝒆𝒕𝒕𝒊𝒂𝒎𝒐 𝒕𝒖𝒕𝒕𝒊 𝒒𝒖𝒊:https://chat.whatsapp.com/EPY9EqMNV6XD0PmVk8jbEb?mode=gi_t


https://chat.whatsapp.com/KtvOQfjpCjFFPWAdBXKOXw




https://chat.whatsapp.com/JkSXVGW8FsDEvttnPJXpfu?mode=hqctcli,`,
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante l'hard wipe.");
    }
};

handler.command = ['nuke'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;