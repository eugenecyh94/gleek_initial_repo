import {
    Box,
    FormHelperText,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
// import uploadImg from '../assets/cloud-upload.png';
// import { ImageConfig } from './FileConfig';
import { Controller, useController, useFormContext } from 'react-hook-form';

//filetype props
const FileType = {
    jpg: 'jpg',
    png: 'png',
    svg: 'svg',
    pdf: 'pdf'
}

//custom styles for boxed components
export const CustomBox = styled(Box)({
    '&.MuiBox-root': {
        backgroundColor: '#fff',
        borderRadius: '2rem',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        padding: '1rem',
    },
    '&.MuiBox-root:hover, &.MuiBox-root.dragover': {
        opacity: 0.6,
    },
});

const ImageAndFileUpload = (ImageUploadProps) => {

    const { limit, multiple, name } = ImageUploadProps;

    // ? Form Context
    // const { control, formState: { isSubmitting, errors } } = useFormContext();

    // ? State with useState()
    // const { field } = useController({ name, control });
    const [fileList, setFileList] = useState([]);
    const wrapperRef = useRef(null);

    // ? Toggle the dragover class
    const onDragEnter = () => wrapperRef.current?.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');

    const onFileDrop = useCallback(
        (e) => {
            const target = e.target;
            if (!target.files) return;

            const newFiles = Object.values(target.files).map((file) => file);
            if (newFiles) {
                const updatedList = [...fileList, ...newFiles];
                if (updatedList.length > limit || newFiles.length > 5) {
                    return alert(`Image must not be more than ${limit}`);
                }
                setFileList(updatedList);
                // field.onChange(updatedList);
            }
        },
        [fileList, limit, multiple]
    );

    // ? remove multiple images
    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
    };

    // ? Calculate Size in KiloByte and MegaByte
    const calcSize = (size) => {
        return size < 1000000
            ? `${Math.floor(size / 1000)} KB`
            : `${Math.floor(size / 1000000)} MB`;
    };

    return (
        <>
            <CustomBox>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '13rem',
                        border: '2px dashed #4267b2',
                        borderRadius: '20px',
                    }}
                    ref={wrapperRef}
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDrop={onDragLeave}
                >
                    <Stack justifyContent='center' sx={{ p: 1, textAlign: 'center' }}>
                        <Typography sx={{ color: '#ccc' }}>
                            {limit > 1 ? 'Browse files to upload' : 'Browse file to upload'}
                        </Typography>
                        <div>
                            <img
                                alt='file upload'
                                style={{ width: '5rem' }}
                            />
                        </div>
                        <Typography variant='body1' component='span'>
                            <strong>Supported Files</strong>
                        </Typography>
                        <Typography variant='body2' component='span'>
                            JPG, JPEG, PNG
                        </Typography>
                    </Stack>
                    <Controller
                        name={name}
                        defaultValue=''
                        control={control}
                        render={({ field: { name, onBlur, ref } }) => (
                            <input
                                type='file'
                                name={name}
                                onBlur={onBlur}
                                ref={ref}
                                onChange={onFileDrop}
                                multiple={multiple}
                                accept='image/jpg, image/png, image/jpeg'
                                style={{
                                    opacity: 0,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer',
                                }}
                            />
                        )}
                    />
                </Box>
            </CustomBox>

            <FormHelperText
                sx={{ textAlign: 'center', my: 1 }}
                error={!!errors[name]}
            >
                {errors[name] ? errors[name].message : ''}
            </FormHelperText>

            {/* ?Image Preview ? */}
            {fileList.length > 0 ? (
                <Stack spacing={2} sx={{ my: 2 }}>
                    {(multiple ? fileList : singleFile).map((item, index) => {
                        const imageType = item.type.split('/')[1]
                        return (
                            <Box
                                key={index}
                                sx={{
                                    position: 'relative',
                                    backgroundColor: '#f5f8ff',
                                    borderRadius: 1.5,
                                    p: 0.5,
                                }}
                            >
                                <Box display='flex'>
                                    <img
                                        // src={ImageConfig[`${imageType}`] || ImageConfig['default']}
                                        alt='upload'
                                        style={{
                                            height: '3.5rem',
                                            objectFit: 'contain',
                                        }}
                                    />
                                    <Box sx={{ ml: 1 }}>
                                        <Typography>{item.name}</Typography>
                                        <Typography variant='body2'>
                                            {calcSize(item.size)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton
                                    onClick={() => { fileRemove(item);
                                    }}
                                    sx={{
                                        color: '#df2c0e',
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        );
                    })}
                </Stack>
            ) : null}
        </>
    );
};

export default ImageAndFileUpload;
