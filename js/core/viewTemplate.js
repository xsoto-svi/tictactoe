export class ViewTemplate {
  constructor() {
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() { throw new Error("Must implement initializeElements()"); }
  setAttributes() { throw new Error("Must implement setAttributes()"); }
  appendElements() { throw new Error("Must implement appendElements()"); }
}