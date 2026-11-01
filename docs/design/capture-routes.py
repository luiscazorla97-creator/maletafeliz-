from html.parser import HTMLParser
import pathlib,hashlib,json,sys
class Snapshot(HTMLParser):
 def __init__(self):super().__init__();self.seo=[];self.ads=[];self.article=[];self.depth=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta' or (tag=='link' and a.get('rel') in ['canonical','alternate']):self.seo.append([tag,attrs])
  if tag=='script' and (a.get('src') or a.get('type')=='application/ld+json'):self.ads.append([tag,attrs])
  if tag=='article':self.depth+=1
 def handle_data(self,d):
  if self.depth:self.article.append(d.strip())
 def handle_endtag(self,t):
  if t=='article':self.depth-=1
result={}
for p in pathlib.Path('dist').rglob('*'):
 if p.is_file() and p.suffix in ['.html','.xml','.txt']:
  name=str(p.relative_to('dist'));s=p.read_text();parser=Snapshot();parser.feed(s)
  result[name]={'seo':parser.seo,'scripts':parser.ads,'articleTextHash':hashlib.sha256(' '.join(parser.article).encode()).hexdigest()}
pathlib.Path(sys.argv[1]).write_text(json.dumps(result,indent=2)+'\n')
print(len(result),'routes captured')
