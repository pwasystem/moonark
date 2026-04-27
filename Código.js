function doGet(e) {
  // Define qual página carregar. Se não houver parâmetro, carrega 'home'
  var page = e.parameter.p || 'home'; 
  
  // O usuário solicitou 'h', mas seus arquivos são home, tech, partner, invest. 
  // Alterado para 'home' para refletir o seu diretório. Se desejar, renomeie home.html para h.html.
  if (page === 'h') page = 'home';
  
  // Cria a saída do arquivo HTML baseado na variável 'page'
  return HtmlService.createHtmlOutputFromFile(page)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function testEmail() {
  var result = sendContactEmail("Teste Antigravity", "spiderpoison@gmail.com", "Esta é uma mensagem de teste do sistema MoonArk.");
  console.log("Resultado do teste: " + JSON.stringify(result));
}

function sendContactEmail(name, email, message) {
  try {
    var subject = "Novo Contato MoonArk: " + name;
    var body = "Nome: " + name + "\nE-mail: " + email + "\n\nMensagem:\n" + message;
    GmailApp.sendEmail("spiderpoison@gmail.com", subject, body);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var result;
    if (data.action === 'contact') {
      result = sendContactEmail(data.name, data.email, data.message);
    } else {
      result = { success: false, error: 'Ação desconhecida' };
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
