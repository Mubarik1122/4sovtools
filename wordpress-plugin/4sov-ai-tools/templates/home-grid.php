<?php
/**
 * Shortcode: [ai_tools_grid]
 *
 * @var array $atts
 */
defined( 'ABSPATH' ) || exit;
?>
<div class="fsov-wrap">
	<article class="fsov-home">
		<header>
			<?php if ( 'no' !== $atts['show_title'] ) : ?>
				<h1><?php esc_html_e( 'Free online tools that just work', '4sov-ai-tools' ); ?></h1>
			<?php endif; ?>
			<p class="fsov-sub"><?php esc_html_e( 'Resize images, remove backgrounds, convert documents and save videos. No sign-up, no watermarks.', '4sov-ai-tools' ); ?></p>
		</header>

		<section aria-label="<?php esc_attr_e( 'Tools', '4sov-ai-tools' ); ?>">
			<div class="fsov-bento">
				<?php foreach ( fsov_cards() as $card ) : ?>
					<a class="fsov-card fsov-glass" href="<?php echo esc_url( home_url( '/' . $card['slug'] . '/' ) ); ?>">
						<span class="fsov-ic" aria-hidden="true"><?php echo esc_html( $card['icon'] ); ?></span>
						<h2><?php echo esc_html( $card['name'] ); ?></h2>
						<p><?php echo esc_html( $card['desc'] ); ?></p>
					</a>
				<?php endforeach; ?>
			</div>
		</section>

		<section>
			<h2 class="fsov-h2"><?php esc_html_e( 'How it works', '4sov-ai-tools' ); ?></h2>
			<div class="fsov-steps">
				<div class="fsov-glass fsov-card"><h3><?php esc_html_e( 'Add your file', '4sov-ai-tools' ); ?></h3><p><?php esc_html_e( 'Drop it in, or paste a link for the YouTube tool.', '4sov-ai-tools' ); ?></p></div>
				<div class="fsov-glass fsov-card"><h3><?php esc_html_e( 'Pick your settings', '4sov-ai-tools' ); ?></h3><p><?php esc_html_e( 'Choose quality, size or format while our engine wakes up.', '4sov-ai-tools' ); ?></p></div>
				<div class="fsov-glass fsov-card"><h3><?php esc_html_e( 'Download the result', '4sov-ai-tools' ); ?></h3><p><?php esc_html_e( 'Files are deleted from our servers within 15 minutes.', '4sov-ai-tools' ); ?></p></div>
			</div>
		</section>

		<section>
			<h2 class="fsov-h2"><?php esc_html_e( 'Questions', '4sov-ai-tools' ); ?></h2>
			<?php foreach ( fsov_faq() as $item ) : ?>
				<details class="fsov-glass fsov-faq">
					<summary><?php echo esc_html( $item[0] ); ?></summary>
					<p><?php echo esc_html( $item[1] ); ?></p>
				</details>
			<?php endforeach; ?>
		</section>
	</article>
</div>
