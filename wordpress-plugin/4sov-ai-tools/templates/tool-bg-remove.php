<?php
/**
 * Shortcode: [ai_tool_bg_remove]
 *
 * @var array $atts
 */
defined( 'ABSPATH' ) || exit;
$card = fsov_cards()['bg'];
?>
<div class="fsov-wrap">
	<article class="fsov-tool" data-fsov-tool="bg">
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
				<p class="fsov-note"><?php esc_html_e( 'Works best on photos with a clear subject. Large images can take up to 30 seconds.', '4sov-ai-tools' ); ?></p>
				<button type="button" class="fsov-btn" data-role="go"><?php esc_html_e( 'Remove background', '4sov-ai-tools' ); ?></button>
				<div class="fsov-bar" data-role="bar" hidden><i></i></div>
				<div data-role="result" aria-live="polite"></div>
			</div>
		</div>
	</article>
</div>
