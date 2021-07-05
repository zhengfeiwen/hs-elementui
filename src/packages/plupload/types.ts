export type prop = {
  runtimes: string,
  browse_button: string,
  container: string,
  url: string,
  chunk_size: string,
  headers: object,
  multipart: boolean,
  max_retries: number,
  multi_selection: boolean,
  unique_names: boolean,
  file_data_name: string,
  flash_swf_url: string,
  silverlight_xap_url: string,
  preinit: preInitMethod,
  init: object,
  [x: string]: any
}

export type preInitMethod = {
  Init: Function,
  UploadFile: Function
}