<script lang="tsx">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'hs-slider-marker'
})

export default class HsMarker extends Vue {
  @Prop({ type: [String, Object] })
  private mark!: string|object|any

  render () {
    const label = typeof this.mark === 'string' ? this.mark : this.mark.label
    return (
      <div class="hs-slider__marks-text" style={ this.mark.style || {} }>
        { label }
      </div>
    )
  }
}

</script>
