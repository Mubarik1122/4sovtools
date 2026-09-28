<?php
/**
 * Shortcode: [ai_tool_image]
 *
 * @var array $atts
 */
defined( 'ABSPATH' ) || exit;
$card = fsov_cards()['image'];
?>
<div class="fsov-wrap">
	<article class="fsov-tool" data-fsov-tool="image">
		<header>
			<?php if ( 'no' !== $atts['show_title'] ) : ?>
				<h1><?php echo esc_html( $card['h1'] ); ?></h1>
			<?php endif; ?>
			<p class="fsov-sub"><?php echo esc_html( $card['desc'] ); ?></p>
		</header>

		<div class="fsov-split">
			<div>
				<label class="fsov-dz" data-role="dz" data-fsov-wake="dragenter">
					<input type="file" data-role="input" data-fsov-wake="click,change" accept="image/jpeg,image/png,image/webp">
					<strong><?php esc_html_e( 'Drop an image here or click to select', '4sov-ai-tools' ); ?></strong>
					<span><?php esc_html_e( 'JPG, PNG or WebP, up to 20 MB', '4sov-ai-tools' ); ?></span>
				</label>
				<div data-role="preview" aria-live="polite"></div>
			</div>

			<div class="fsov-glass fsov-panel">
				<div class="fsov-row">
					<div><label><?php esc_html_e( 'Quality', '4sov-ai-tools' ); ?>: <output data-role="qv">80</output>%</label><input type="range" data-role="quality" min="10" max="100" value="80"></div>
					<div><label for="fsov-w"><?php esc_html_e( 'Width (px)', '4sov-ai-tools' ); ?></label><input id="fsov-w" type="number" min="1" data-role="width" placeholder="<?php esc_attr_e( 'auto', '4sov-ai-tools' ); ?>"></div>
					<div><label for="fsov-h"><?php esc_html_e( 'Height (px)', '4sov-ai-tools' ); ?></label><input id="fsov-h" type="number" min="1" data-role="height" placeholder="<?php esc_attr_e( 'auto', '4sov-ai-tools' ); ?>"></div>
					<div><label for="fsov-f"><?php esc_html_e( 'Format', '4sov-ai-tools' ); ?></label>
						<select id="fsov-f" data-role="format"><option value="webp">WebP</option><option value="jpeg">JPEG</option><option value="png">PNG</option></select></div>
				</div>
				<button type="button" class="fsov-btn" data-role="go"><?php esc_html_e( 'Compress image', '4sov-ai-tools' ); ?></button>
				<div class="fsov-bar" data-role="bar" hidden><i></i></div>
				<div data-role="result" aria-live="polite"></div>
			</div>
		</div>
	</article>
</div>
