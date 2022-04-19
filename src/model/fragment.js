// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
const md = require('markdown-it')();
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const sharp = require('sharp');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      throw Error('ID and ownerId are required');
    }
    if (typeof size != 'number' || size < 0) {
      throw Error('size must be a number');
    }
    if (!Fragment.isSupportedType(type)) {
      throw Error('type must be valid');
    }
    const now = new Date();
    this.id = id || nanoid();
    this.ownerId = ownerId;
    this.created = created || now.toISOString();
    this.updated = updated || now.toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      const fragments = await listFragments(ownerId, expand);
      return expand ? fragments.map((fragment) => new Fragment(fragment)) : fragments;
    } catch {
      return [];
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    var fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error();
    } else {
      return new Fragment({ ...fragment });
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    let now = new Date();
    this.updated = now.toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Convert the fragment's data to different type
   * @returns Promise<Buffer>
   */
  async convertData(type) {
    const rawData = await this.getData();
    if (type != this.mimeType) {
      if (type == 'text/html') {
        const stringData = rawData.toString();
        return md.render(stringData);
      }
      const imageReg = /image\/*/;
      if (imageReg.test(type)) {
        const format = type.replace('image/', '');
        const data = await sharp(rawData).toFormat(format).toBuffer();
        return data;
      }
    }
    return rawData;
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (!data) {
      throw new Error();
    }
    let now = new Date();
    this.updated = now.toISOString();
    this.size = data.byteLength;
    //we need to update the dynamoDB size here
    await writeFragment(this);
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const re = /text\/*/;
    return re.test(this.mimeType);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    switch (this.mimeType) {
      case 'text/plain':
        return ['text/plain'];
      case 'text/markdown':
        return ['text/markdown', 'text/html', 'text/plain'];
      case 'text/html':
        return ['text/html', 'text/plain'];
      case 'application/json':
        return ['text/plain', 'application/json'];
      case 'image/png':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      case 'image/jpeg':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      case 'image/webp':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      case 'image/gif':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      default:
        return [];
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const supportedType = [
      'text/plain',
      'application/json',
      `text/markdown`,
      `text/html`,
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ];
    const { type } = contentType.parse(value);
    return supportedType.includes(type);
  }
}

module.exports.Fragment = Fragment;
