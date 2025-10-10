declare module 'mathquill4quill' {
  interface MathQuill4QuillOptions {
    Quill?: any;
    katex?: any;
    operators?: string[][][];
    // Có thể thêm các tuỳ chọn khác nếu cần
    [key: string]: any;
  }

  const mathquill4quill: (
    options?: MathQuill4QuillOptions
  ) => (quill: any, opts?: any) => void;

  export default mathquill4quill;
}
