<?php
/**
 * Plugin Name: 4sov AI Tools
 * Description: Free online tools (image resizer, background remover, Word/PDF converter, YouTube downloader) powered by the 4sov backend.
 * Version:     1.0.0
 * Author:      4sov
 * License:     GPL-2.0-or-later
 * Text Domain: 4sov-ai-tools
 *
 * @package FSOV_AI_Tools
 */

defined( 'ABSPATH' ) || exit;

define( 'FSOV_VERSION', '1.0.0' );
define( 'FSOV_DIR', plugin_dir_path( __FILE__ ) );
define( 'FSOV_URL', plugin_dir_url( __FILE__ ) );

/**
 * Backend URL. Set it under Settings > 4sov AI Tools, or define FSOV_BACKEND_URL in wp-config.php.
 */
function fsov_backend_url() {
	if ( defined( 'FSOV_BACKEND_URL' ) ) {
		return untrailingslashit( FSOV_BACKEND_URL );
	}
	return untrailingslashit( get_option( 'fsov_backend_url', 'https://YOUR-RENDER-URL.onrender.com' ) );
}

/**
 * The five tools. Keys double as the mode names used by the PDF shortcode.
 */
function fsov_cards() {
	return array(
		'image'         => array(
			'slug' => 'image-resizer',
			'icon' => '🖼️',
			'name' => __( 'Image Resizer', '4sov-ai-tools' ),
			'h1'   => __( 'Free Online Image Resizer & Compressor', '4sov-ai-tools' ),
			'desc' => __( 'Compress and resize JPG, PNG and WebP images.', '4sov-ai-tools' ),
		),
		'bg'            => array(
			'slug' => 'background-remover',
			'icon' => '✂️',
			'name' => __( 'Background Remover', '4sov-ai-tools' ),
			'h1'   => __( 'Free Online Background Remover', '4sov-ai-tools' ),
			'desc' => __( 'Remove image backgrounds with AI and download a transparent PNG.', '4sov-ai-tools' ),
		),
		'word-to-pdf'   => array(
			'slug' => 'word-to-pdf',
			'icon' => '📄',
			'name' => __( 'Word to PDF', '4sov-ai-tools' ),
			'h1'   => __( 'Free Online Word to PDF Converter', '4sov-ai-tools' ),
			'desc' => __( 'Convert .docx documents to PDF.', '4sov-ai-tools' ),
		),
		'pdf-to-word'   => array(
			'slug' => 'pdf-to-word',
			'icon' => '📝',
			'name' => __( 'PDF to Word', '4sov-ai-tools' ),
			'h1'   => __( 'Free Online PDF to Word Converter', '4sov-ai-tools' ),
			'desc' => __( 'Turn PDF files into editable .docx documents.', '4sov-ai-tools' ),
		),
		'youtube'       => array(
			'slug' => 'youtube-downloader',
			'icon' => '▶️',
			'name' => __( 'YouTube Downloader', '4sov-ai-tools' ),
			'h1'   => __( 'Free YouTube Video & Audio Downloader', '4sov-ai-tools' ),
			'desc' => __( 'Save a video as MP4 or its audio as MP3.', '4sov-ai-tools' ),
		),
	);
}

/** Shortcode tag => script file (without .js). The grid has no script. */
function fsov_shortcodes() {
	return array(
		'ai_tools_grid'     => array( 'template' => 'home-grid.php', 'script' => '' ),
		'ai_tool_image'     => array( 'template' => 'tool-image.php', 'script' => 'image-tool' ),
		'ai_tool_bg_remove' => array( 'template' => 'tool-bg-remove.php', 'script' => 'bg-remove-tool' ),
		'ai_tool_pdf'       => array( 'template' => 'tool-pdf.php', 'script' => 'pdf-tool' ),
		'ai_tool_youtube'   => array( 'template' => 'tool-yt.php', 'script' => 'yt-tool' ),
	);
}

/** FAQ used by both the homepage template and its FAQPage schema. */
function fsov_faq() {
	return array(
		array( __( 'Are these tools really free?', '4sov-ai-tools' ), __( 'Yes. There are no accounts, no watermarks and no usage fees.', '4sov-ai-tools' ) ),
		array( __( 'Why does the first conversion take longer?', '4sov-ai-tools' ), __( 'Our processing engine sleeps when idle. It starts waking as soon as you pick a file, so most people never notice.', '4sov-ai-tools' ) ),
		array( __( 'Are my files kept?', '4sov-ai-tools' ), __( 'No. Uploads are deleted from our servers automatically within 15 minutes.', '4sov-ai-tools' ) ),
		array( __( 'Which file types are supported?', '4sov-ai-tools' ), __( 'JPG, PNG and WebP images, Word (.docx) and PDF documents, and YouTube links.', '4sov-ai-tools' ) ),
	);
}

/** Which of our shortcodes are used on the current page (with their attributes). */
function fsov_detect() {
	static $found = null;
	if ( null !== $found ) {
		return $found;
	}
	$found = array();
	$post  = get_post();
	if ( ! $post || ! is_singular() ) {
		return $found;
	}
	$tags = array_keys( fsov_shortcodes() );
	if ( preg_match_all( '/' . get_shortcode_regex( $tags ) . '/', $post->post_content, $m, PREG_SET_ORDER ) ) {
		foreach ( $m as $s ) {
			$found[] = array(
				'tag'  => $s[2],
				'atts' => (array) shortcode_parse_atts( $s[3] ),
			);
		}
	}
	return $found;
}

/** Card key for a detected shortcode, or '' for the grid. */
function fsov_card_key( $tag, $atts ) {
	$map = array( 'ai_tool_image' => 'image', 'ai_tool_bg_remove' => 'bg', 'ai_tool_youtube' => 'youtube' );
	if ( 'ai_tool_pdf' === $tag ) {
		return ( isset( $atts['mode'] ) && 'pdf-to-word' === $atts['mode'] ) ? 'pdf-to-word' : 'word-to-pdf';
	}
	return isset( $map[ $tag ] ) ? $map[ $tag ] : '';
}

/* ---------- Shortcodes ---------- */

function fsov_render( $template, $atts ) {
	$atts = shortcode_atts(
		array(
			'show_title' => 'yes',
			'mode'       => 'word-to-pdf',
		),
		$atts
	);
	ob_start();
	include FSOV_DIR . 'templates/' . $template;
	return ob_get_clean();
}

function fsov_register_shortcodes() {
	foreach ( fsov_shortcodes() as $tag => $cfg ) {
		$template = $cfg['template'];
		add_shortcode(
			$tag,
			function ( $atts ) use ( $template ) {
				return fsov_render( $template, $atts );
			}
		);
	}
}
add_action( 'init', 'fsov_register_shortcodes' );

/* ---------- Load assets only on pages that use a tool ---------- */

function fsov_enqueue() {
	$found = fsov_detect();
	if ( ! $found ) {
		return;
	}
	$cfgs = fsov_shortcodes();
	wp_enqueue_style( 'fsov-ui', FSOV_URL . 'assets/css/ui-style.css', array(), FSOV_VERSION );
	wp_enqueue_style( 'fsov-font', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap', array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters

	$has_tool = false;
	foreach ( $found as $f ) {
		if ( ! empty( $cfgs[ $f['tag'] ]['script'] ) ) {
			$has_tool = true;
			break;
		}
	}
	if ( ! $has_tool ) {
		return;
	}

	wp_enqueue_script( 'fsov-prewarm', FSOV_URL . 'assets/js/prewarm.js', array(), FSOV_VERSION, true );
	wp_add_inline_script( 'fsov-prewarm', 'window.FSOV=' . wp_json_encode( array( 'api' => fsov_backend_url() ) ) . ';', 'before' );

	foreach ( $found as $f ) {
		$script = $cfgs[ $f['tag'] ]['script'];
		if ( ! $script ) {
			continue;
		}
		$deps = array( 'fsov-prewarm' );
		if ( 'ai_tool_pdf' === $f['tag'] ) {
			wp_enqueue_script( 'fsov-mammoth', 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js', array(), '1.6.0', true );
			wp_enqueue_script( 'fsov-pdfjs', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', array(), '3.11.174', true );
			wp_add_inline_script( 'fsov-pdfjs', 'window.pdfjsLib&&(pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js");' );
			$deps[] = 'fsov-mammoth';
			$deps[] = 'fsov-pdfjs';
		}
		wp_enqueue_script( 'fsov-' . $script, FSOV_URL . 'assets/js/' . $script . '.js', $deps, FSOV_VERSION, true );
	}
}
add_action( 'wp_enqueue_scripts', 'fsov_enqueue' );

function fsov_body_class( $classes ) {
	if ( fsov_detect() ) {
		$classes[] = 'fsov-page';
	}
	return $classes;
}
add_filter( 'body_class', 'fsov_body_class' );

/* ---------- SEO: JSON-LD, plus title/description fallbacks when no SEO plugin is active ---------- */

function fsov_has_seo_plugin() {
	return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' );
}

function fsov_first_card() {
	$cards = fsov_cards();
	foreach ( fsov_detect() as $f ) {
		$key = fsov_card_key( $f['tag'], $f['atts'] );
		if ( $key ) {
			return $cards[ $key ];
		}
	}
	return null;
}

function fsov_schema() {
	$cards = fsov_cards();
	foreach ( fsov_detect() as $f ) {
		$key = fsov_card_key( $f['tag'], $f['atts'] );
		if ( $key ) {
			$c    = $cards[ $key ];
			$data = array(
				'@context'            => 'https://schema.org',
				'@type'               => 'WebApplication',
				'name'                => $c['h1'],
				'description'         => $c['desc'],
				'url'                 => get_permalink(),
				'applicationCategory' => 'UtilitiesApplication',
				'operatingSystem'     => 'Any',
				'browserRequirements' => 'Requires JavaScript',
				'offers'              => array( '@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'USD' ),
			);
		} elseif ( 'ai_tools_grid' === $f['tag'] ) {
			$qa = array();
			foreach ( fsov_faq() as $item ) {
				$qa[] = array( '@type' => 'Question', 'name' => $item[0], 'acceptedAnswer' => array( '@type' => 'Answer', 'text' => $item[1] ) );
			}
			$data = array( '@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $qa );
		} else {
			continue;
		}
		echo '<script type="application/ld+json">' . wp_json_encode( $data, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP ) . "</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
add_action( 'wp_head', 'fsov_schema' );

function fsov_meta_description() {
	$card = fsov_first_card();
	if ( $card && ! fsov_has_seo_plugin() ) {
		echo '<meta name="description" content="' . esc_attr( $card['desc'] . ' ' . __( 'Free, no sign-up, files deleted after 15 minutes.', '4sov-ai-tools' ) ) . '">' . "\n";
	}
}
add_action( 'wp_head', 'fsov_meta_description', 1 );

function fsov_title( $title ) {
	$card = fsov_first_card();
	if ( $card && ! fsov_has_seo_plugin() ) {
		return $card['h1'] . ' | ' . get_bloginfo( 'name' );
	}
	return $title;
}
add_filter( 'pre_get_document_title', 'fsov_title', 20 );

/* ---------- Settings page ---------- */

function fsov_settings_init() {
	register_setting(
		'fsov',
		'fsov_backend_url',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'esc_url_raw',
			'default'           => 'https://YOUR-RENDER-URL.onrender.com',
		)
	);
}
add_action( 'admin_init', 'fsov_settings_init' );

function fsov_settings_menu() {
	add_options_page( '4sov AI Tools', '4sov AI Tools', 'manage_options', 'fsov', 'fsov_settings_page' );
}
add_action( 'admin_menu', 'fsov_settings_menu' );

function fsov_settings_page() {
	?>
	<div class="wrap">
		<h1>4sov AI Tools</h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'fsov' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="fsov_backend_url"><?php esc_html_e( 'Backend URL', '4sov-ai-tools' ); ?></label></th>
					<td>
						<input type="url" class="regular-text" id="fsov_backend_url" name="fsov_backend_url" value="<?php echo esc_attr( get_option( 'fsov_backend_url', '' ) ); ?>" placeholder="https://your-service.onrender.com">
						<p class="description"><?php esc_html_e( 'The Render service that runs the tools. No trailing slash.', '4sov-ai-tools' ); ?></p>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}
