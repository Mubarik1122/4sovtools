<?php
/**
 * Shortcode: [ai_tool_youtube]
 *
 * @var array $atts
 */
defined( 'ABSPATH' ) || exit;
$card = fsov_cards()['youtube'];
?>
<div class="fsov-wrap">
	<article class="fsov-tool" data-fsov-tool="youtube">
		<header>
			<?php if ( 'no' !== $atts['show_title'] ) : ?>
				<h1><?php echo esc_html( $card['h1'] ); ?></h1>
			<?php endif; ?>
			<p class="fsov-sub"><?php echo esc_html( $card['desc'] ); ?></p>
		</header>

		<div class="fsov-split">
			<div>
				<div class="fsov-glass fsov-panel fsov-flush">
					<label for="fsov-url"><?php esc_html_e( 'YouTube link', '4sov-ai-tools' ); ?></label>
					<input type="text" id="fsov-url" data-role="url" data-fsov-wake="focus,paste" placeholder="https://www.youtube.com/watch?v=…" autocomplete="off">
					<p class="fsov-error" data-role="error" role="alert"></p>
					<button type="button" class="fsov-btn" data-role="fetch"><?php esc_html_e( 'Fetch media', '4sov-ai-tools' ); ?></button>
				</div>
				<div data-role="preview" aria-live="polite"></div>
			</div>

			<div class="fsov-glass fsov-panel">
				<div class="fsov-row">
					<div>
						<label for="fsov-preset"><?php esc_html_e( 'Format', '4sov-ai-tools' ); ?></label>
						<select id="fsov-preset" data-role="preset">
							<option value="mp4-1080">MP4 · 1080p</option>
							<option value="mp4-720">MP4 · 720p</option>
							<option value="mp3">MP3 · 320 kbps</option>
						</select>
					</div>
				</div>
				<button type="button" class="fsov-btn" data-role="go"><?php esc_html_e( 'Download', '4sov-ai-tools' ); ?></button>
				<div class="fsov-bar" data-role="bar" hidden><i></i></div>
				<p class="fsov-note" data-role="status" aria-live="polite"></p>
				<div data-role="result" aria-live="polite"></div>
				<p class="fsov-note"><?php esc_html_e( 'Only download content you own or have permission to save.', '4sov-ai-tools' ); ?></p>
			</div>
		</div>
	</article>
</div>
