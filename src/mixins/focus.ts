export default function (ref: any) {
  return {
    methods: {
      focus () {
        (this as any).$refs[ref].focus()
      }
    }
  }
}
