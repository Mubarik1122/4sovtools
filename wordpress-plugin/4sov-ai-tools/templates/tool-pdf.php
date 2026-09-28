<?php
/**
 * Shortcode: [ai_tool_pdf mode="word-to-pdf|pdf-to-word"]
 *
 * @var array $atts
 */
defined( 'ABSPATH' ) || exit;
$mode   = 'pdf-to-word' === $atts['mode'] ? 'pdf-to-word' : 'word-to-pdf';
$card   = fsov_cards()[ $mode ];
$accept = 'pdf-to-word' === $mode ? '.pdf,application/pdf' : '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
$ext    = 'pdf-to-word' === $mode ? '.pdf' : '.docx';
?>
<div class="fsov-wrap">
	<article class="fsov-tool" data-fsov-tool="pdf" data-mode="<?php echo esc_attr( $mode ); ?>">
		<header>
			<?php if ( 'no' !== $atts['show_title'] ) : ?>
				<h1><?php echo esc_html( $card['h1'] ); ?></h1>
			<?php endif; ?>
			<p class="fsov-sub"><?php echo esc_html( $card['desc'] ); ?></p>
		</header>

		<div class="fsov-split">
			<div>
				<label class="fsov-dz" data-role="dz" data-fsov-wake="dragenter">
					<input type="file" data-role="input" data-fsov-wake="click,change" accept="<?php echo esc_attr( $accept ); ?>">
					<strong>
						<?php
						/* translators: %s: file extension such as .pdf */
						printf( esc_html__( 'Drop a %s file here or browse', '4sov-ai-tools' ), esc_html( $ext ) );
						?>
					</strong>
					<span><?php esc_html_e( 'Up to 25 MB', '4sov-ai-tools' ); ?></span>
				</label>
				<div data-role="preview" aria-live="polite"></div>
			</div>

			<div class="fsov-glass fsov-panel">
				<?php if ( 'pdf-to-word' === $mode ) : ?>
					<p class="fsov-note"><?php esc_html_e( 'Text-based PDFs convert best. Scanned pages are treated as images.', '4sov-ai-tools' ); ?></p>
				<?php endif; ?>
				<button type="button" class="fsov-btn" data-role="go"><?php echo esc_html( 'pdf-to-word' === $mode ? __( 'Convert to Word', '4sov-ai-tools' ) : __( 'Convert to PDF', '4sov-ai-tools' ) ); ?></button>
				<div class="fsov-bar" data-role="bar" hidden><i></i></div>
				<p class="fsov-note" data-role="status" aria-live="polite"></p>
				<div data-role="result" aria-live="polite"></div>
			</div>
		</div>
	</article>
</div>
