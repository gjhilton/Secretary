import { css } from '../../../dist/styled-system/css';
import { FONT_SIZE_SMALL, flexCenter } from '@lib/constants/ui';

const PADDING = '2.5rem 0 3rem';
const NOTE_TOP_POSITION = 'sm';
const NOTE_PADDING_VERTICAL = 'xs';
const NOTE_PADDING_HORIZONTAL = 'sm';
const NOTE_Z_INDEX = 1;
const BASELINE_POSITION = '56.5%';

export const CharacterImage = ({
	imagePath,
	caption,
	showBaseline = false,
	baselineColor = 'baseline',
	note,
}) => (
	<div
		className={css({
			background: '{colors.paper}',
			height: '100%',
			width: '100%',
			...flexCenter,
							   display:'flex',                                                 justifyContent:'center',                                              alignItems: 'flex-start',  
			padding: PADDING,
			position: 'relative',
		})}
	>
		{note && (
			<div
				className={css({
					position: 'absolute',
					top: NOTE_TOP_POSITION,
					left: '50%',
					transform: 'translateX(-50%)',
					paddingTop: NOTE_PADDING_VERTICAL,
					paddingBottom: NOTE_PADDING_VERTICAL,
					paddingLeft: NOTE_PADDING_HORIZONTAL,
					paddingRight: NOTE_PADDING_HORIZONTAL,
					background: 'transparent',
					color: '{colors.ink}',
					fontSize: FONT_SIZE_SMALL,
					whiteSpace: 'nowrap',
					zIndex: NOTE_Z_INDEX,
				})}
			>
				{note}
			</div>
		)}
		<div
			className={css({
				position: 'relative',
				display: 'inline-flex',
				maxWidth: '100%',
				maxHeight: '100%',
			})}
		>
			<img
				key={imagePath}
				src={imagePath}
				alt={caption || 'Character to identify'}
				className={css({
					maxWidth: '100%',
					maxHeight: '100%',
					objectFit: 'contain',
					display: 'block',
				})}
			/>
			{showBaseline && (
				<div
					className={`character-image-baseline ${css({
						position: 'absolute',
						top: BASELINE_POSITION,
						left: '0',
						right: '0',
						borderBottom: `2px solid {colors.${baselineColor}}`,
						pointerEvents: 'none',
						mixBlendMode: 'darken',
					})}`}
					aria-hidden="true"
				/>
			)}
		</div>
	</div>
);
