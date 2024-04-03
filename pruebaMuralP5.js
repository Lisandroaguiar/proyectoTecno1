let inputText = "";
let input;
let button;
let colorPicker;
let previewBox;
let closeButton;
let messages = [];
var fondo;

function preload(){
  fondo= loadImage("data/fondoCorcho.png");
}
function setup() {
  createCanvas(298, 501);
  
  input = createInput();
  input.position(20,450);
  input.input(showPreview);
  
  button = createButton('Enviar');
  button.position(input.x + input.width, 450);
  button.mousePressed(addMessage);

  colorPicker = createColorPicker(color(255, 0, 0));
  colorPicker.position(button.x + button.width , 20);

  previewBox = new PreviewBox(width / 2 - 100, height / 2 - 100);
  previewBox.hide();

  closeButton = createButton('Cerrar');
  closeButton.position(previewBox.x + previewBox.width / 2 - 25, previewBox.y + previewBox.height + 10);
  closeButton.mousePressed(closePreview);
  closeButton.hide(); // Ocultar el botón de cerrar inicialmente
}

function draw() {
background(fondo);
  // Mostrar los mensajes
  for (let i = 0; i < messages.length; i++) {
    messages[i].display();
  }

  // Mostrar el cuadro de vista previa
  previewBox.display();
}

function showPreview() {
  if (input.value().length > 0) {
    previewBox.show();
    closeButton.show(); // Mostrar el botón de cerrar cuando se muestra el cuadro de vista previa
  } else {
    previewBox.hide();
    closeButton.hide(); // Ocultar el botón de cerrar si no hay texto
  }
  previewBox.updateText(input.value());
  previewBox.updateColor(colorPicker.color());
}

function addMessage() {
  inputText = input.value();
  let x = random(width - 50); // Posición x aleatoria
  let y = random(height - 50); // Posición y aleatoria
  let color = colorPicker.color();
  messages.push(new Message(inputText, x, y, color));
  input.value('');
  previewBox.hide();
  closeButton.hide(); // Ocultar el botón de cerrar al agregar un nuevo mensaje
}

function closePreview() {
  previewBox.hide();
  closeButton.hide();
}

function mouseClicked() {
  // Verificar si se hizo clic en algún cuadrado
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].contains(mouseX, mouseY)) {
      previewBox.show();
      previewBox.updateText(messages[i].text);
      previewBox.updateColor(messages[i].color);
      closeButton.show(); // Mostrar el botón de cerrar al hacer clic en un cuadrado existente
      return; // Salir del bucle una vez que se haya encontrado un cuadrado clicado
    }
  }
}

class Message {
  constructor(text, x, y, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.color = color;
  }

  display() {
    fill(this.color);
      noStroke();
    rect(this.x, this.y, this.width, this.height);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  // Verificar si las coordenadas (x, y) están dentro del cuadrado
  contains(x, y) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    );
  }
}

class PreviewBox {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 200;
    this.color = color(255);
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  updateText(text) {
    this.text = text;
  }

  updateColor(newColor) {
    this.color = newColor;
  }

  display() {
    if (this.visible) {
      fill(this.color);
      noStroke();
      rect(this.x, this.y, this.width, this.height);
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }
  }
}
