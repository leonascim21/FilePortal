package utils

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type SpacesUploader struct {
	client     *s3.S3
	bucketName string
}

func NewSpacesUploader() *SpacesUploader {
	accessKey, secretKey, region, bucketName :=
		os.Getenv("DO_SPACES_KEY"),
		os.Getenv("DO_SPACES_SECRET"),
		os.Getenv("DO_SPACES_REGION"),
		os.Getenv("DO_SPACES_BUCKET")

	sess := session.Must(session.NewSession(&aws.Config{
		Region:           aws.String("us-east-1"),
		Credentials:      credentials.NewStaticCredentials(accessKey, secretKey, ""),
		Endpoint:         aws.String(fmt.Sprintf("https://%s.digitaloceanspaces.com", region)),
		S3ForcePathStyle: aws.Bool(true),
	}))

	return &SpacesUploader{
		client:     s3.New(sess),
		bucketName: bucketName,
	}
}

func (u *SpacesUploader) UploadFile(file io.Reader, filename string) (string, error) {
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, file); err != nil {
		return "", fmt.Errorf("failed to read file into buffer: %v", err)
	}

	_, err := u.client.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(u.bucketName),
		Key:    aws.String(fmt.Sprintf("uploads/%s", filename)),
		Body:   bytes.NewReader(buf.Bytes()),
		ACL:    aws.String("public-read"),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file: %v", err)
	}

	fileURL := fmt.Sprintf("https://%s.%s.digitaloceanspaces.com/uploads/%s", u.bucketName, os.Getenv("DO_SPACES_REGION"), filename)
	log.Printf("File uploaded: %s", fileURL)
	return fileURL, nil
}

func (u *SpacesUploader) DeleteFile(filename string) (*s3.DeleteObjectOutput, error) {
	input := &s3.DeleteObjectInput{
		Bucket: aws.String(u.bucketName),
		Key:    aws.String(fmt.Sprintf("uploads/%s", filename)),
	}
	return u.client.DeleteObject(input)
}
