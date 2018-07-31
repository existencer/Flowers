#version 300 es

layout (location = 0) in highp vec2 aVertexPosition;

uniform sampler2D uDepthTexture;
layout (std140) uniform uboMatrix {
  highp mat4 uViewMatrix;
  highp mat4 uProjectionMatrix;
};
layout (std140) uniform uboIsland {
  highp int uPrecision;
  highp float uMaxHeight;
  highp float uCaveDown;
};


out highp vec2 vTexCoord;

void main() {
  highp float dis = 1.0 / float(uPrecision);
  highp float offsetX = float(gl_InstanceID % uPrecision);
  highp float offsetY = float(gl_InstanceID / uPrecision);
  highp vec2 flagPos = aVertexPosition + vec2(offsetX, offsetY);
  vTexCoord = flagPos * dis;
  highp float depth = texture(uDepthTexture, vTexCoord).r * uMaxHeight - uCaveDown;
  highp vec2 fixedFlagPos = (flagPos - vec2(float(uPrecision) / 2.0)) / 2.0;
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(fixedFlagPos.x, depth ,fixedFlagPos.y, 1.0);
}
